import uuid
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User, UserSession

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    username: str

class LoginResponse(BaseModel):
    message: str
    user_id: int
    username: str
    display_name: str

@router.post("/login", response_model=LoginResponse)
def login(
    payload: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username"
        )

    # Generate a secure session ID
    session_id = str(uuid.uuid4())
    # 7 days expiration
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)

    user_session = UserSession(
        session_id=session_id,
        user_id=user.id,
        expires_at=expires_at
    )
    db.add(user_session)
    db.commit()

    # Set HttpOnly cookie
    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        samesite="lax",
        max_age=7 * 24 * 60 * 60,  # 7 days in seconds
    )

    return LoginResponse(
        message="Login successful",
        user_id=user.id,
        username=user.username,
        display_name=user.display_name
    )

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="session_id")
    return {"message": "Logged out"}
