from datetime import datetime, date
from sqlalchemy import Integer, String, DateTime, Date, Boolean, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    xp_total: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    streak_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_activity: Mapped[date | None] = mapped_column(Date, nullable=True)
    hearts: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    gems: Mapped[int] = mapped_column(Integer, default=500, nullable=False)
    daily_xp_goal: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    last_wrong_answer_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    skill_progress: Mapped[list["UserSkillProgress"]] = relationship(
        "UserSkillProgress", back_populates="user", lazy="select"
    )
    lesson_attempts: Mapped[list["LessonAttempt"]] = relationship(
        "LessonAttempt", back_populates="user", lazy="select"
    )
    leaderboard_entries: Mapped[list["LeaderboardEntry"]] = relationship(
        "LeaderboardEntry", back_populates="user", lazy="select"
    )
    sessions: Mapped[list["UserSession"]] = relationship(
        "UserSession", back_populates="user", lazy="select", cascade="all, delete-orphan"
    )

class UserSession(Base):
    __tablename__ = "user_sessions"

    session_id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship("User", back_populates="sessions")


# Import here to avoid circular imports
from app.models.progress import UserSkillProgress, LessonAttempt, LeaderboardEntry  # noqa: E402, F401
