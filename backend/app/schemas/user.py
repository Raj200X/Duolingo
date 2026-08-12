from datetime import datetime, date
from pydantic import BaseModel, Field


class UserPublic(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_url: str | None
    xp_total: int
    streak_count: int
    last_activity: date | None
    hearts: int
    gems: int
    daily_xp_goal: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    display_name: str | None = Field(None, min_length=1, max_length=100)
    daily_xp_goal: int | None = Field(None, ge=10, le=500)


class UserStats(BaseModel):
    user: UserPublic
    total_skills_completed: int
    total_lessons_completed: int
    total_xp: int
    streak_count: int
    hearts: int
    gems: int
    daily_xp_earned: int
    daily_xp_goal: int
