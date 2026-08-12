// Shared TypeScript types matching backend Pydantic schemas

export type ExerciseType =
  | "multiple_choice"
  | "translate_wordbank"
  | "match_pairs"
  | "fill_blank"
  | "type_answer";

export type SkillState = "locked" | "available" | "in_progress" | "completed";

export interface User {
  id: number;
  username: string;
  display_name: string;
  avatar_url: string | null;
  xp_total: number;
  streak_count: number;
  last_activity: string | null;
  hearts: number;
  gems: number;
  daily_xp_goal: number;
  created_at: string;
}

export interface UserStats {
  user: User;
  total_skills_completed: number;
  total_lessons_completed: number;
  total_xp: number;
  streak_count: number;
  hearts: number;
  gems: number;
  daily_xp_earned: number;
  daily_xp_goal: number;
}

export interface Exercise {
  id: number;
  type: ExerciseType;
  order_index: number;
  prompt: string;
  prompt_translation: string | null;
  options: string[] | Array<{ l: string; r: string }> | null;
  hint: string | null;
}

export interface AnswerCheckResponse {
  correct: boolean;
  correct_answer: string | Array<{ l: string; r: string }>;
  explanation: string | null;
}

export interface SkillProgress {
  skill_id: number;
  crowns: number;
  completed: boolean;
  last_practiced: string | null;
}

export interface Skill {
  id: number;
  title: string;
  description: string | null;
  order_index: number;
  icon: string | null;
  xp_per_lesson: number;
  total_lessons: number;
  state: SkillState;
  progress: SkillProgress | null;
}

export interface Unit {
  id: number;
  title: string;
  description: string | null;
  order_index: number;
  color_hex: string;
  icon: string | null;
  skills: Skill[];
}

export interface Course {
  id: number;
  name: string;
  description: string | null;
  flag_emoji: string | null;
}

export interface SkillTree {
  course: Course;
  units: Unit[];
}

export interface LessonCompleteResponse {
  xp_earned: number;
  bonus_xp: number;
  new_xp_total: number;
  streak_count: number;
  hearts_remaining: number;
  skill_id: number;
  crowns: number;
  skill_completed: boolean;
}

export interface LeaderboardEntry {
  user_id: number;
  display_name: string;
  avatar_url: string | null;
  xp_this_week: number;
  rank: number;
  is_current_user: boolean;
}

export interface LeaderboardResponse {
  week_start: string;
  entries: LeaderboardEntry[];
}

export interface StreakResponse {
  streak_count: number;
  last_activity: string | null;
  daily_xp_earned: number;
  daily_xp_goal: number;
  daily_xp_progress_pct: number;
}
