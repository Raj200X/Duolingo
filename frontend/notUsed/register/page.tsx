"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";
import "../Auth.css";

export default function RegisterPage() {
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
        <h1 className="auth-title">Create your profile</h1>
        
        <div className="auth-form-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <span className="auth-label">Age</span>
              <input 
                type="number" 
                className="auth-input" 
                placeholder="Age" 
                required
              />
            </div>
            
            <div className="auth-input-group">
              <span className="auth-label">Name (optional)</span>
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Name" 
              />
            </div>

            <div className="auth-input-group">
              <span className="auth-label">Email</span>
              <input 
                type="email" 
                className="auth-input" 
                placeholder="Email" 
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
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-muted" style={{ fontSize: "13px", fontWeight: 600 }}>
            By signing in to Chamelo, you agree to our <span className="font-bold hover:underline cursor-pointer">Terms</span> and <span className="font-bold hover:underline cursor-pointer">Privacy Policy</span>.
          </div>
        </div>
      </main>
    </div>
  );
}
