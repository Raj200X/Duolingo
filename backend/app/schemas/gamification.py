from datetime import date
from pydantic import BaseModel


class LeaderboardUser(BaseModel):
    user_id: int
    display_name: str
    avatar_url: str | None
    xp_this_week: int
    rank: int
    is_current_user: bool

    model_config = {"from_attributes": True}


class LeaderboardResponse(BaseModel):
    week_start: date
    entries: list[LeaderboardUser]


class StreakResponse(BaseModel):
    streak_count: int
    last_activity: date | None
    daily_xp_earned: int
    daily_xp_goal: int
    daily_xp_progress_pct: float


class HeartsRefillResponse(BaseModel):
    hearts: int
    message: str
