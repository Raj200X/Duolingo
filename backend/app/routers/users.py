from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserPublic, UserUpdate, UserStats
from app.services.gamification import GamificationService
from datetime import date

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
def get_me(
    response: Response,
    user: User = Depends(get_current_user),
):
    """Get current user profile. Also sets the session cookie if not present."""
    response.set_cookie(
        key="user_id",
        value=str(user.id),
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 365,  # 1 year
    )
    return user


@router.patch("/me", response_model=UserPublic)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.display_name is not None:
        user.display_name = payload.display_name
    if payload.daily_xp_goal is not None:
        user.daily_xp_goal = payload.daily_xp_goal
    db.commit()
    db.refresh(user)
    return user


@router.get("/me/stats", response_model=UserStats)
def get_my_stats(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    from app.models.progress import UserSkillProgress, LessonAttempt
    from sqlalchemy import func
    from datetime import datetime

    total_skills_completed = (
        db.query(func.count(UserSkillProgress.id))
        .filter(
            UserSkillProgress.user_id == user.id,
            UserSkillProgress.completed == True,
        )
        .scalar()
        or 0
    )

    total_lessons_completed = (
        db.query(func.count(LessonAttempt.id))
        .filter(
            LessonAttempt.user_id == user.id,
            LessonAttempt.completed == True,
        )
        .scalar()
        or 0
    )

    svc = GamificationService(db)
    daily_xp = svc._get_daily_xp(user, date.today())

    return UserStats(
        user=UserPublic.model_validate(user),
        total_skills_completed=total_skills_completed,
        total_lessons_completed=total_lessons_completed,
        total_xp=user.xp_total,
        streak_count=user.streak_count,
        hearts=user.hearts,
        gems=user.gems,
        daily_xp_earned=daily_xp,
        daily_xp_goal=user.daily_xp_goal,
    )
