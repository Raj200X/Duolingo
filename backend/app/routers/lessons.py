import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.course import Lesson, Exercise
from app.schemas.course import ExercisePublic, LessonCompleteRequest, LessonCompleteResponse
from app.services.gamification import GamificationService

router = APIRouter(prefix="/lessons", tags=["lessons"])


def _serialize_exercise(ex: Exercise) -> ExercisePublic:
    """Convert Exercise ORM to public schema — NEVER include correct_answer."""
    options_parsed = None
    if ex.options:
        try:
            options_parsed = json.loads(ex.options)
        except (json.JSONDecodeError, TypeError):
            options_parsed = None

    return ExercisePublic(
        id=ex.id,
        type=ex.type,
        order_index=ex.order_index,
        prompt=ex.prompt,
        prompt_translation=ex.prompt_translation,
        options=options_parsed,
        hint=ex.hint,
    )


@router.get("/{lesson_id}/exercises", response_model=list[ExercisePublic])
def get_exercises(
    lesson_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    exercises = (
        db.query(Exercise)
        .filter(Exercise.lesson_id == lesson_id)
        .order_by(Exercise.order_index)
        .all()
    )
    return [_serialize_exercise(ex) for ex in exercises]


@router.post("/{lesson_id}/complete", response_model=LessonCompleteResponse)
def complete_lesson(
    lesson_id: int,
    payload: LessonCompleteRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    svc = GamificationService(db)
    return svc.complete_lesson(
        user=user,
        lesson=lesson,
        hearts_lost=payload.hearts_lost,
        time_taken_seconds=payload.time_taken_seconds,
    )
