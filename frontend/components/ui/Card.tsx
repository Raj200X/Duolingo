import React from "react";
import "./Card.css";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
}

export function Card({ 
  children, 
  className = "", 
  padding = "md", 
  interactive = false,
  ...props 
}: CardProps) {
  return (
    <div 
      className={`duo-card duo-card-p-${padding} ${interactive ? "duo-card-interactive" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
