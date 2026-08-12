"use client";

import { create } from "zustand";
import type { Exercise, AnswerCheckResponse } from "@/types";

export type FeedbackState = "idle" | "correct" | "incorrect" | "completed";

interface LessonState {
  exercises: Exercise[];
  currentIndex: number;
  lessonSessionId: number | null;
  correctAnswers: number;
  totalTimeSeconds: number;
  feedbackState: FeedbackState;
  lastFeedback: AnswerCheckResponse | null;
  isComplete: boolean;
  startTime: number;

  // Actions
  initLesson: (exercises: Exercise[]) => void;
  setLessonSessionId: (id: number) => void;
  setFeedback: (state: FeedbackState, feedback?: AnswerCheckResponse) => void;
  nextExercise: () => void;
  completeLesson: () => void;
  reset: () => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  exercises: [],
  currentIndex: 0,
  lessonSessionId: null,
  correctAnswers: 0,
  totalTimeSeconds: 0,
  feedbackState: "idle",
  lastFeedback: null,
  isComplete: false,
  startTime: Date.now(),

  initLesson: (exercises) =>
    set({
      exercises,
      currentIndex: 0,
      lessonSessionId: null,
      correctAnswers: 0,
      totalTimeSeconds: 0,
      startTime: Date.now(),
      isComplete: false,
      feedbackState: "idle",
      lastFeedback: null,
    }),

  setLessonSessionId: (id) => set({ lessonSessionId: id }),

  setFeedback: (state, feedback) =>
    set({ feedbackState: state, lastFeedback: feedback ?? null }),

  nextExercise: () =>
    set((s) => ({
      currentIndex: s.currentIndex + 1,
      feedbackState: "idle",
      lastFeedback: null,
    })),

  completeLesson: () => set({ isComplete: true, feedbackState: "completed" }),

  reset: () =>
    set({
      exercises: [],
      currentIndex: 0,
      lessonSessionId: null,
      correctAnswers: 0,
      totalTimeSeconds: 0,
      feedbackState: "idle",
      lastFeedback: null,
      isComplete: false,
      startTime: Date.now(),
    }),
}));
