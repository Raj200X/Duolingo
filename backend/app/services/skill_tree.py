"""
SkillTreeService: computes the full skill tree with per-user progress and unlock state.
All unlock logic lives here — the frontend only renders what this service returns.
"""
from sqlalchemy.orm import Session

from app.models.course import Course, Unit, Skill
from app.models.progress import UserSkillProgress
from app.models.user import User
from app.schemas.course import CoursePublic, SkillTreeResponse, UnitPublic, SkillPublic, SkillProgressPublic


class SkillTreeService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_courses(self) -> list[Course]:
        return self.db.query(Course).all()

    def get_skill_tree_with_progress(self, course_id: int, user: User) -> SkillTreeResponse:
        course = self.db.query(Course).filter(Course.id == course_id).first()
        if not course:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Course not found")

        units = (
            self.db.query(Unit)
            .filter(Unit.course_id == course_id)
            .order_by(Unit.order_index)
            .all()
        )

        # Fetch all skill progress for this user in one query (avoid N+1)
        skill_ids = [
            skill.id
            for unit in units
            for skill in unit.skills
        ]
        progress_map: dict[int, UserSkillProgress] = {}
        if skill_ids:
            progress_rows = (
                self.db.query(UserSkillProgress)
                .filter(
                    UserSkillProgress.user_id == user.id,
                    UserSkillProgress.skill_id.in_(skill_ids),
                )
                .all()
            )
            progress_map = {p.skill_id: p for p in progress_rows}

        # Compute unlock state for each skill
        # Flatten all skills ordered by (unit.order_index, skill.order_index)
        all_skills: list[tuple[int, int, Skill]] = []
        for unit in units:
            for skill in unit.skills:
                all_skills.append((unit.order_index, skill.order_index, skill))

        # Build a set of completed skill IDs
        completed_ids = {
            skill_id for skill_id, prog in progress_map.items() if prog.completed
        }

        # Determine state for each skill
        skill_states: dict[int, str] = {}
        for i, (unit_idx, skill_idx, skill) in enumerate(all_skills):
            if i == 0:
                # First skill is always available
                state = "available"
            else:
                prev_skill = all_skills[i - 1][2]
                if prev_skill.id in completed_ids:
                    state = "available"
                else:
                    state = "locked"

            # Override if has progress
            prog = progress_map.get(skill.id)
            if prog:
                if prog.completed:
                    state = "completed"
                elif prog.crowns > 0:
                    state = "in_progress"

            skill_states[skill.id] = state

        # Build response
        unit_responses = []
        for unit in units:
            skill_responses = []
            for skill in unit.skills:
                prog = progress_map.get(skill.id)
                prog_schema = None
                if prog:
                    prog_schema = SkillProgressPublic(
                        skill_id=prog.skill_id,
                        crowns=prog.crowns,
                        completed=prog.completed,
                        last_practiced=prog.last_practiced,
                    )
                skill_responses.append(
                    SkillPublic(
                        id=skill.id,
                        title=skill.title,
                        description=skill.description,
                        order_index=skill.order_index,
                        icon=skill.icon,
                        xp_per_lesson=skill.xp_per_lesson,
                        total_lessons=skill.total_lessons,
                        state=skill_states[skill.id],
                        progress=prog_schema,
                    )
                )
            unit_responses.append(
                UnitPublic(
                    id=unit.id,
                    title=unit.title,
                    description=unit.description,
                    order_index=unit.order_index,
                    color_hex=unit.color_hex,
                    icon=unit.icon,
                    skills=skill_responses,
                )
            )

        return SkillTreeResponse(
            course=CoursePublic(
                id=course.id,
                name=course.name,
                description=course.description,
                flag_emoji=course.flag_emoji,
            ),
            units=unit_responses,
        )
