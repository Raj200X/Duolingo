"use client";

import { useState } from "react";
import type { Exercise } from "@/types";
import "./Exercise.css";

interface TranslateWordBankProps {
  exercise: Exercise;
  onAnswer: (answer: string) => void;
  disabled: boolean;
  correctAnswer?: string;
}

export function TranslateWordBank({ exercise, onAnswer, disabled, correctAnswer }: TranslateWordBankProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const wordBank = (exercise.options as string[]) || [];

  function addWord(word: string, idx: number) {
    if (disabled) return;
    setSelected((prev) => [...prev, `${word}__${idx}`]);
  }

  function removeWord(tokenIdx: number) {
    if (disabled) return;
    setSelected((prev) => prev.filter((_, i) => i !== tokenIdx));
  }

  function getAnswerText() {
    return selected.map((t) => t.split("__")[0]).join(" ");
  }

  function handleCheck() {
    onAnswer(getAnswerText());
  }

  const usedTokens = new Set(selected);

  return (
    <div style={{ width: "100%" }}>
      <div className="exercise-prompt">
        {exercise.prompt}
        {exercise.prompt_translation && (
          <div className="exercise-prompt-sub">{exercise.prompt_translation}</div>
        )}
      </div>

      {/* Answer area — selected words */}
      <div className="wordbank-area" style={{ minHeight: 64, marginBottom: 16 }}>
        {selected.length === 0 && (
          <span style={{ color: "var(--text-muted)", fontWeight: 600, fontSize: 14, alignSelf: "center" }}>
            Tap the words to build your answer
          </span>
        )}
        {selected.map((token, i) => {
          const word = token.split("__")[0];
          return (
            <button
              key={`${token}-${i}`}
              className="word-chip"
              onClick={() => removeWord(i)}
              disabled={disabled}
              style={{
                background: correctAnswer
                  ? getAnswerText().toLowerCase() === correctAnswer.toLowerCase()
                    ? "#d7ffb8"
                    : "#ffdfe0"
                  : "var(--bg-card)",
                borderColor: correctAnswer
                  ? getAnswerText().toLowerCase() === correctAnswer.toLowerCase()
                    ? "var(--duo-green)"
                    : "var(--duo-red)"
                  : "var(--border-dark)",
              }}
            >
              {word}
            </button>
          );
        })}
      </div>

      {/* Word bank */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 24 }}>
        {wordBank.map((word, idx) => {
          const token = `${word}__${idx}`;
          const isUsed = usedTokens.has(token);
          return (
            <button
              key={`bank-${idx}`}
              className={`word-chip${isUsed ? " used" : ""}`}
              onClick={() => !isUsed && addWord(word, idx)}
              disabled={disabled || isUsed}
            >
              {word}
            </button>
          );
        })}
      </div>

      {!disabled && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            className="btn btn-primary"
            onClick={handleCheck}
            disabled={selected.length === 0}
            style={{ width: "100%", maxWidth: 400 }}
          >
            Check
          </button>
        </div>
      )}
    </div>
  );
}
