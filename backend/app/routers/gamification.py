from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.gamification import LeaderboardResponse, StreakResponse, HeartsRefillResponse
from app.services.gamification import GamificationService

router = APIRouter(prefix="/gamification", tags=["gamification"])


@router.get("/leaderboard", response_model=LeaderboardResponse)
def get_leaderboard(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    svc = GamificationService(db)
    return svc.get_leaderboard(user)


@router.get("/streak", response_model=StreakResponse)
def get_streak(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    svc = GamificationService(db)
    return svc.get_streak_info(user)


@router.post("/hearts/refill", response_model=HeartsRefillResponse)
def refill_hearts(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    svc = GamificationService(db)
    result = svc.refill_hearts(user)
    db.commit()
    return result
