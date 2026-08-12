"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  // Lesson player has its own full-screen layout — no sidebar
  const isLessonPage = pathname.startsWith("/lesson/");

  if (isLessonPage) {
    return <>{children}</>;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}
