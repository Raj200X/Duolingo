"use client";

import { useState, useEffect } from "react";
import type { Exercise } from "@/types";
import "./Exercise.css";

interface Pair {
  l: string;
  r: string;
}

interface MatchPairsProps {
  exercise: Exercise;
  onAnswer: (answer: Pair[]) => void;
  disabled: boolean;
}

export function MatchPairs({ exercise, onAnswer, disabled }: MatchPairsProps) {
  const pairs: Pair[] = (exercise.options as Pair[]) || [];
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Pair[]>([]);
  const [errorPair, setErrorPair] = useState<{ l?: string; r?: string }>({});

  const leftItems = pairs.map((p) => p.l);
  const rightItems = [...pairs.map((p) => p.r)].sort(() => Math.random() - 0.5);
  // Use stable shuffled order
  const [shuffledRight] = useState(() => [...pairs.map((p) => p.r)].sort(() => Math.random() - 0.5));

  function isMatchedLeft(l: string) { return matched.some((m) => m.l === l); }
  function isMatchedRight(r: string) { return matched.some((m) => m.r === r); }

  function handleLeft(l: string) {
    if (disabled || isMatchedLeft(l)) return;
    setSelectedLeft(l);
    if (selectedRight) tryMatch(l, selectedRight);
  }

  function handleRight(r: string) {
    if (disabled || isMatchedRight(r)) return;
    setSelectedRight(r);
    if (selectedLeft) tryMatch(selectedLeft, r);
  }

  function tryMatch(l: string, r: string) {
    const correctPair = pairs.find((p) => p.l === l);
    if (correctPair?.r === r) {
      const newMatched = [...matched, { l, r }];
      setMatched(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);
      setErrorPair({});
      if (newMatched.length === pairs.length) {
        onAnswer(newMatched);
      }
    } else {
      setErrorPair({ l, r });
      setTimeout(() => {
        setErrorPair({});
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    }
  }

  function getLeftClass(l: string) {
    if (isMatchedLeft(l)) return "matched";
    if (errorPair.l === l) return "error";
    if (selectedLeft === l) return "selected";
    return "";
  }

  function getRightClass(r: string) {
    if (isMatchedRight(r)) return "matched";
    if (errorPair.r === r) return "error";
    if (selectedRight === r) return "selected";
    return "";
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="exercise-prompt">{exercise.prompt}</div>
      <div className="match-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {leftItems.map((l) => (
            <button
              key={l}
              className={`match-item ${getLeftClass(l)}`}
              onClick={() => handleLeft(l)}
              disabled={disabled || isMatchedLeft(l)}
            >
              {l}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {shuffledRight.map((r) => (
            <button
              key={r}
              className={`match-item ${getRightClass(r)}`}
              onClick={() => handleRight(r)}
              disabled={disabled || isMatchedRight(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: 16, color: "var(--text-muted)", fontSize: 13, fontWeight: 600 }}>
        {matched.length}/{pairs.length} matched
      </div>
    </div>
  );
}
