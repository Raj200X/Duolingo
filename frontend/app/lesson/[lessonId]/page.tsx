"use client";

import { use } from "react";
import { LessonPlayer } from "@/components/lesson/LessonPlayer";

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default function LessonPage({ params }: LessonPageProps) {
  const { lessonId: lessonIdStr } = use(params);
  const lessonId = parseInt(lessonIdStr, 10);
  if (isNaN(lessonId)) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 48 }}>❌</div>
        <div style={{ fontWeight: 700, marginTop: 16 }}>Invalid lesson ID</div>
      </div>
    );
  }
  return <LessonPlayer lessonId={lessonId} />;
}
