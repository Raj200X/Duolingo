import React from "react";
import "./Button.css";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "locked";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export function Button({ 
  variant = "primary", 
  children, 
  className = "", 
  disabled, 
  ...props 
}: ButtonProps) {
  // If explicitly disabled, or variant is locked, disable the button
  const isDisabled = disabled || variant === "locked";
  
  return (
    <button
      className={`duo-btn duo-btn-${variant} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      <div className="duo-btn-content">
        {children}
      </div>
    </button>
  );
}
