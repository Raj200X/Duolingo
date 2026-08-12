"use client";

import { create } from "zustand";
import type { Exercise, AnswerCheckResponse } from "@/types";

export type FeedbackState = "idle" | "correct" | "incorrect" | "completed";

interface LessonState {
  exercises: Exercise[];
  currentIndex: number;
  heartsLost: number;
  feedbackState: FeedbackState;
  lastFeedback: AnswerCheckResponse | null;
  isComplete: boolean;
  startTime: number;

  // Actions
  setExercises: (exercises: Exercise[]) => void;
  setFeedback: (state: FeedbackState, feedback?: AnswerCheckResponse) => void;
  nextExercise: () => void;
  loseHeart: () => void;
  completeLesson: () => void;
  reset: () => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  exercises: [],
  currentIndex: 0,
  heartsLost: 0,
  feedbackState: "idle",
  lastFeedback: null,
  isComplete: false,
  startTime: Date.now(),

  setExercises: (exercises) =>
    set({ exercises, currentIndex: 0, heartsLost: 0, feedbackState: "idle", isComplete: false, startTime: Date.now() }),

  setFeedback: (state, feedback) =>
    set({ feedbackState: state, lastFeedback: feedback ?? null }),

  nextExercise: () =>
    set((s) => ({
      currentIndex: s.currentIndex + 1,
      feedbackState: "idle",
      lastFeedback: null,
    })),

  loseHeart: () => set((s) => ({ heartsLost: s.heartsLost + 1 })),

  completeLesson: () => set({ isComplete: true, feedbackState: "completed" }),

  reset: () =>
    set({
      exercises: [],
      currentIndex: 0,
      heartsLost: 0,
      feedbackState: "idle",
      lastFeedback: null,
      isComplete: false,
      startTime: Date.now(),
    }),
}));
