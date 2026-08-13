"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import "../Auth.css";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request before redirecting to bypass backend auth
    setTimeout(() => {
      document.cookie = "chamelo_session=true; path=/; max-age=86400";
      router.push("/learn");
    }, 800);
  };

  return (
    <div className="auth-layout">
      <header className="auth-header" style={{ justifyContent: "flex-start" }}>
        <Link href="/" className="text-muted hover:text-main transition-colors">
          <X size={28} strokeWidth={2.5} />
        </Link>
      </header>

      <main className="auth-page-content">
        <h1 className="auth-title">Log in</h1>
        
        <div className="auth-form-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <span className="auth-label">Email or username</span>
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Email or username" 
                required
              />
            </div>
            
            <div className="auth-input-group">
              <span className="auth-label">Password</span>
              <input 
                type="password" 
                className="auth-input" 
                placeholder="Password" 
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-muted" style={{ fontSize: "14px", fontWeight: 700 }}>
            Don't have an account? <Link href="/register" className="font-bold hover:underline" style={{ color: "#1CB0F6" }}>Sign up</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
