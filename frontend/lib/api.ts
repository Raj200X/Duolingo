import axios from "axios";
import type {
  User,
  UserStats,
  Exercise,
  AnswerCheckResponse,
  SkillTree,
  LessonCompleteResponse,
  LeaderboardResponse,
  StreakResponse,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true, // Send session cookie
  headers: { "Content-Type": "application/json" },
});

// ------------------------------------------------------------------ //
// Users                                                                //
// ------------------------------------------------------------------ //
export const getMe = (): Promise<User> =>
  api.get("/users/me").then((r) => r.data);

export const getMyStats = (): Promise<UserStats> =>
  api.get("/users/me/stats").then((r) => r.data);

// ------------------------------------------------------------------ //
// Courses & Skill Tree                                                 //
// ------------------------------------------------------------------ //
export const getSkillTree = (courseId: number): Promise<SkillTree> =>
  api.get(`/courses/${courseId}/skill-tree`).then((r) => r.data);

// ------------------------------------------------------------------ //
// Lessons                                                              //
// ------------------------------------------------------------------ //
export const getLessonExercises = (lessonId: number): Promise<Exercise[]> =>
  api.get(`/lessons/${lessonId}/exercises`).then((r) => r.data);

export const completeLesson = (
  lessonId: number,
  heartsLost: number,
  timeTakenSeconds: number
): Promise<LessonCompleteResponse> =>
  api
    .post(`/lessons/${lessonId}/complete`, {
      hearts_lost: heartsLost,
      time_taken_seconds: timeTakenSeconds,
    })
    .then((r) => r.data);

// ------------------------------------------------------------------ //
// Exercise answer checking                                             //
// ------------------------------------------------------------------ //
export const checkAnswer = (
  exerciseId: number,
  answer: string | Array<{ l: string; r: string }>
): Promise<AnswerCheckResponse> =>
  api
    .post(`/exercises/${exerciseId}/check`, { answer })
    .then((r) => r.data);

// ------------------------------------------------------------------ //
// Gamification                                                         //
// ------------------------------------------------------------------ //
export const getLeaderboard = (): Promise<LeaderboardResponse> =>
  api.get("/gamification/leaderboard").then((r) => r.data);

export const getStreak = (): Promise<StreakResponse> =>
  api.get("/gamification/streak").then((r) => r.data);

export const refillHearts = (): Promise<{ hearts: number; message: string }> =>
  api.post("/gamification/hearts/refill").then((r) => r.data);
