from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.course import Course
from app.schemas.course import CoursePublic, SkillTreeResponse
from app.services.skill_tree import SkillTreeService

router = APIRouter(prefix="/courses", tags=["courses"])


@router.get("", response_model=list[CoursePublic])
def list_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    return courses


@router.get("/{course_id}/skill-tree", response_model=SkillTreeResponse)
def get_skill_tree(
    course_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    svc = SkillTreeService(db)
    return svc.get_skill_tree_with_progress(course_id, user)
