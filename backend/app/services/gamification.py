"""
GamificationService: handles streak, XP, hearts, and leaderboard.
All gamification state transitions are atomic DB updates.
"""
import json
from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User
from app.models.progress import LeaderboardEntry, UserSkillProgress, LessonAttempt
from app.models.course import Lesson, Skill
from app.schemas.gamification import (
    LeaderboardResponse,
    LeaderboardUser,
    StreakResponse,
    HeartsRefillResponse,
)
from app.schemas.course import LessonCompleteResponse


class StreakBrokenError(Exception):
    pass


class HeartsEmptyError(Exception):
    pass


class GamificationService:
    def __init__(self, db: Session):
        self.db = db

    # ------------------------------------------------------------------ #
    # Streak                                                               #
    # ------------------------------------------------------------------ #

    def update_streak(self, user: User) -> int:
        """
        Update streak based on last_activity. Returns new streak count.
        - Same day: no change
        - Yesterday: increment
        - Older / None: reset to 1
        """
        today = date.today()
        if user.last_activity == today:
            return user.streak_count

        if user.last_activity == today - timedelta(days=1):
            user.streak_count += 1
        else:
            user.streak_count = 1

        user.last_activity = today
        self.db.flush()
        return user.streak_count

    def get_streak_info(self, user: User) -> StreakResponse:
        today = date.today()
        daily_xp = self._get_daily_xp(user, today)
        progress_pct = min(100.0, (daily_xp / user.daily_xp_goal) * 100)
        return StreakResponse(
            streak_count=user.streak_count,
            last_activity=user.last_activity,
            daily_xp_earned=daily_xp,
            daily_xp_goal=user.daily_xp_goal,
            daily_xp_progress_pct=progress_pct,
        )

    def _get_daily_xp(self, user: User, day: date) -> int:
        """Sum XP earned from completed lesson attempts today."""
        start = datetime.combine(day, datetime.min.time())
        end = datetime.combine(day, datetime.max.time())
        from sqlalchemy import func
        result = (
            self.db.query(func.sum(LessonAttempt.xp_earned))
            .filter(
                LessonAttempt.user_id == user.id,
                LessonAttempt.completed == True,
                LessonAttempt.completed_at >= start,
                LessonAttempt.completed_at <= end,
            )
            .scalar()
        )
        return result or 0

    # ------------------------------------------------------------------ #
    # XP                                                                   #
    # ------------------------------------------------------------------ #

    def calculate_xp(self, skill: Skill, hearts_lost: int) -> tuple[int, int]:
        """Returns (base_xp, bonus_xp)."""
        base_xp = skill.xp_per_lesson
        bonus_xp = settings.BONUS_XP_FULL_HEARTS if hearts_lost == 0 else 0
        return base_xp, bonus_xp

    # ------------------------------------------------------------------ #
    # Hearts                                                               #
    # ------------------------------------------------------------------ #

    def compute_current_hearts(self, user: User) -> int:
        """
        Compute current hearts including time-based regeneration.
        Regen: +1 heart per HEART_REGEN_MINUTES minutes since last wrong answer.
        """
        if user.hearts >= settings.HEARTS_MAX:
            return settings.HEARTS_MAX
        if user.last_wrong_answer_at is None:
            return user.hearts

        elapsed_minutes = (datetime.utcnow() - user.last_wrong_answer_at).total_seconds() / 60
        regen = int(elapsed_minutes // settings.HEART_REGEN_MINUTES)
        return min(settings.HEARTS_MAX, user.hearts + regen)

    def decrement_hearts(self, user: User) -> int:
        """Decrement hearts by 1 (source of truth for wrong answer). Returns new count."""
        current = self.compute_current_hearts(user)
        # Sync regen before decrementing
        user.hearts = current
        if user.hearts > 0:
            user.hearts -= 1
            user.last_wrong_answer_at = datetime.utcnow()
        self.db.flush()
        return user.hearts

    def refill_hearts(self, user: User) -> HeartsRefillResponse:
        """Practice-based heart refill — resets to max. (Mocked, no gem cost.)"""
        user.hearts = settings.HEARTS_MAX
        user.last_wrong_answer_at = None
        self.db.flush()
        return HeartsRefillResponse(hearts=user.hearts, message="Hearts refilled!")

    # ------------------------------------------------------------------ #
    # Lesson completion                                                    #
    # ------------------------------------------------------------------ #

    def complete_lesson(
        self,
        user: User,
        lesson: Lesson,
        hearts_lost: int,
        time_taken_seconds: int,
    ) -> LessonCompleteResponse:
        """
        Atomic lesson completion:
        1. Update streak
        2. Calculate and award XP
        3. Decrement hearts (already done per-question, just sync here)
        4. Update skill progress (crowns)
        5. Update leaderboard
        6. Record LessonAttempt
        """
        skill = lesson.skill
        base_xp, bonus_xp = self.calculate_xp(skill, hearts_lost)
        total_xp = base_xp + bonus_xp

        # Update streak
        new_streak = self.update_streak(user)

        # Award XP
        user.xp_total += total_xp

        # Sync hearts (deductions already applied per-question)
        current_hearts = self.compute_current_hearts(user)
        user.hearts = current_hearts

        # Update skill progress
        skill_progress = (
            self.db.query(UserSkillProgress)
            .filter(
                UserSkillProgress.user_id == user.id,
                UserSkillProgress.skill_id == skill.id,
            )
            .first()
        )
        if not skill_progress:
            skill_progress = UserSkillProgress(
                user_id=user.id,
                skill_id=skill.id,
                crowns=0,
                completed=False,
            )
            self.db.add(skill_progress)

        if skill_progress.crowns < 5:
            skill_progress.crowns += 1
        skill_progress.last_practiced = datetime.utcnow()
        if skill_progress.crowns >= skill.total_lessons:
            skill_progress.completed = True

        # Record lesson attempt
        attempt = LessonAttempt(
            user_id=user.id,
            lesson_id=lesson.id,
            xp_earned=total_xp,
            completed=True,
            completed_at=datetime.utcnow(),
        )
        self.db.add(attempt)

        # Update leaderboard
        week_start = self._get_week_start()
        lb_entry = (
            self.db.query(LeaderboardEntry)
            .filter(
                LeaderboardEntry.user_id == user.id,
                LeaderboardEntry.week_start == week_start,
            )
            .first()
        )
        if lb_entry:
            lb_entry.xp_this_week += total_xp
        else:
            lb_entry = LeaderboardEntry(
                user_id=user.id,
                xp_this_week=total_xp,
                week_start=week_start,
            )
            self.db.add(lb_entry)

        self.db.commit()
        self.db.refresh(user)
        self.db.refresh(skill_progress)

        return LessonCompleteResponse(
            xp_earned=base_xp,
            bonus_xp=bonus_xp,
            new_xp_total=user.xp_total,
            streak_count=new_streak,
            hearts_remaining=user.hearts,
            skill_id=skill.id,
            crowns=skill_progress.crowns,
            skill_completed=skill_progress.completed,
        )

    # ------------------------------------------------------------------ #
    # Leaderboard                                                          #
    # ------------------------------------------------------------------ #

    def get_leaderboard(self, user: User) -> LeaderboardResponse:
        week_start = self._get_week_start()
        entries = (
            self.db.query(LeaderboardEntry)
            .filter(LeaderboardEntry.week_start == week_start)
            .order_by(LeaderboardEntry.xp_this_week.desc())
            .all()
        )
        result = []
        for rank, entry in enumerate(entries, start=1):
            result.append(
                LeaderboardUser(
                    user_id=entry.user_id,
                    display_name=entry.user.display_name,
                    avatar_url=entry.user.avatar_url,
                    xp_this_week=entry.xp_this_week,
                    rank=rank,
                    is_current_user=entry.user_id == user.id,
                )
            )
        return LeaderboardResponse(week_start=week_start, entries=result)

    @staticmethod
    def _get_week_start() -> date:
        today = date.today()
        return today - timedelta(days=today.weekday())  # Monday

    # ------------------------------------------------------------------ #
    # Answer checking                                                      #
    # ------------------------------------------------------------------ #

    def check_answer(
        self,
        exercise,
        answer: str | list,
        user: User,
    ) -> tuple[bool, str | list]:
        """
        Validates answer server-side. Never sends correct_answer to client before this call.
        Returns (is_correct, correct_answer_for_display).
        """
        correct_raw = exercise.correct_answer
        ex_type = exercise.type

        if ex_type == "match_pairs":
            # answer is list of {"l": ..., "r": ...}
            import json as _json
            correct = _json.loads(correct_raw)
            # Sort both to allow any order
            def sort_pairs(pairs):
                return sorted(pairs, key=lambda x: x.get("l", ""))
            is_correct = sort_pairs(answer) == sort_pairs(correct)
            return is_correct, correct

        # All other types: string comparison
        correct_str = correct_raw.strip()
        answer_str = str(answer).strip()
        is_correct = correct_str.lower() == answer_str.lower()

        if not is_correct:
            # Decrement hearts for wrong answer
            self.decrement_hearts(user)

        return is_correct, correct_str
