from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User


def get_current_user(
    db: Session = Depends(get_db),
    user_id: int | None = Cookie(default=None),
) -> User:
    """
    Simplified auth dependency.
    Reads user_id from HttpOnly cookie. Falls back to the default seeded user.
    Replacing this one function is all that's needed to add real authentication.
    """
    uid = user_id if user_id is not None else settings.DEFAULT_USER_ID
    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found. Ensure the database is seeded.",
        )
    return user
