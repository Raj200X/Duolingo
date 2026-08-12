"use client";

import { useState } from "react";
import type { Exercise } from "@/types";
import "./Exercise.css";

interface MultipleChoiceProps {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  correctAnswer?: string;
  userAnswer?: string;
}

export function MultipleChoice({ exercise, onAnswer, disabled, correctAnswer, userAnswer }: MultipleChoiceProps) {
  const options = (exercise.options as string[]) || [];

  function getOptionClass(opt: string) {
    if (!userAnswer) return "";
    if (opt === correctAnswer && userAnswer) return "correct";
    if (opt === userAnswer && userAnswer !== correctAnswer) return "incorrect";
    if (opt === userAnswer) return "selected";
    return "";
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="exercise-prompt">
        {exercise.prompt}
        {exercise.prompt_translation && (
          <div className="exercise-prompt-sub">{exercise.prompt_translation}</div>
        )}
      </div>
      <div className="mc-options">
        {options.map((opt) => (
          <button
            key={opt}
            className={`mc-option ${getOptionClass(opt)} ${disabled ? "disabled" : ""}`}
            onClick={() => !disabled && onAnswer(opt)}
            disabled={disabled}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
