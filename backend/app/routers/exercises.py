import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.course import Exercise
from app.schemas.course import AnswerCheckRequest, AnswerCheckResponse
from app.services.gamification import GamificationService

router = APIRouter(prefix="/exercises", tags=["exercises"])


@router.post("/{exercise_id}/check", response_model=AnswerCheckResponse)
def check_answer(
    exercise_id: int,
    payload: AnswerCheckRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")

    svc = GamificationService(db)
    is_correct, correct_answer = svc.check_answer(exercise, payload.answer, user)

    # Commit the heart update (if wrong)
    db.commit()

    return AnswerCheckResponse(
        correct=is_correct,
        correct_answer=correct_answer,
        explanation=exercise.hint if not is_correct else None,
    )
