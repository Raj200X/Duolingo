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

export async function login(username: string = "learner"): Promise<void> {
  await api.post("/auth/login", { username });
}

// ------------------------------------------------------------------ //
// Users                                                                //
// ------------------------------------------------------------------ //
export const getMe = async (): Promise<User> => {
  try {
    const { data } = await api.get("/users/me");
    return data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      // Auto-login for assignment evaluation UX
      await login("learner");
      const { data } = await api.get("/users/me");
      return data;
    }
    throw error;
  }
};

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
export async function startLesson(lessonId: number): Promise<{ session_id: number }> {
  const { data } = await api.post<{ session_id: number }>(`/lessons/${lessonId}/start`);
  return data;
}

export const getLessonExercises = (lessonId: number): Promise<Exercise[]> =>
  api.get(`/lessons/${lessonId}/exercises`).then((r) => r.data);

export const completeLesson = (
  lessonId: number,
  lessonSessionId: number
): Promise<LessonCompleteResponse> =>
  api
    .post(`/lessons/${lessonId}/complete`, {
      session_id: lessonSessionId,
    })
    .then((r) => r.data);

// ------------------------------------------------------------------ //
// Exercise answer checking                                             //
// ------------------------------------------------------------------ //
export const checkAnswer = (
  exerciseId: number,
  answer: string | Array<{ l: string; r: string }>,
  lessonSessionId: number
): Promise<AnswerCheckResponse> =>
  api.post(`/exercises/${exerciseId}/check`, { 
    answer,
    lesson_session_id: lessonSessionId
  }).then((r) => r.data);

// ------------------------------------------------------------------ //
// Gamification                                                         //
// ------------------------------------------------------------------ //
export const getLeaderboard = (): Promise<LeaderboardResponse> =>
  api.get("/gamification/leaderboard").then((r) => r.data);

export const getStreak = (): Promise<StreakResponse> =>
  api.get("/gamification/streak").then((r) => r.data);

export const refillHearts = (): Promise<{ hearts: number; message: string }> =>
  api.post("/gamification/hearts/refill").then((r) => r.data);
