from fastapi import Cookie, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from datetime import datetime, timezone
from app.models.user import User, UserSession


def get_current_user(
    db: Session = Depends(get_db),
    session_id: str | None = Cookie(default=None),
) -> User:
    """
    Validates the session_id from the HttpOnly cookie.
    Ensures the session hasn't expired.
    """
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    user_session = db.query(UserSession).filter(UserSession.session_id == session_id).first()
    
    if not user_session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session",
        )
        
    if user_session.expires_at.tzinfo is None:
        expires = user_session.expires_at.replace(tzinfo=timezone.utc)
    else:
        expires = user_session.expires_at
        
    if expires < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired",
        )

    return user_session.user
