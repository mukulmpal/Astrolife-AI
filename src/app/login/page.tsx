"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function getNextPath() {
  if (typeof window === "undefined") return "/dashboard";
  const next = new URLSearchParams(window.location.search).get("next");
  return next?.startsWith("/") ? next : "/dashboard";
}

export default function LoginPage() {
  const queryState = () => {
    if (typeof window === "undefined") return { error: "", message: "" };
    const params = new URLSearchParams(window.location.search);
    return {
      error: params.get("error") ? decodeURIComponent(params.get("error") ?? "") : "",
      message: params.get("message") ? decodeURIComponent(params.get("message") ?? "") : "",
    };
  };

  const initialQueryState = queryState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(initialQueryState.message);
  const [error, setError] = useState(initialQueryState.error);

  // Email form state
  const [authMethod, setAuthMethod] = useState<"otp" | "password">("otp");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Auto-redirect if already logged in
  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          window.location.assign(getNextPath());
        }
      });
    } catch {
      // ignore
    }
  }, []);

  const handleGoogle = () => {
    setError("");
    setMessage("");
    setLoading(true);
    const next = getNextPath();
    window.location.assign(`/auth/google?next=${encodeURIComponent(next)}`);
  };

  // 1. Send Email OTP / Magic Link
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();
      const next = getNextPath();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          shouldCreateUser: true,
        },
      });

      if (otpError) throw otpError;

      setOtpSent(true);
      setMessage("Login code sent! Please check your email inbox (and spam folder).");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send login code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Email OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length < 6) {
      setError("Please enter the 6-digit code received in your email.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: otpCode.trim(),
        type: "email",
      });

      if (verifyError) throw verifyError;
      if (data?.session) {
        window.location.assign(getNextPath());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code. Please re-check or request a new code.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Email + Password (Sign In or Sign Up)
  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();

      if (isSignUp) {
        // Sign Up
        const next = getNextPath();
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          window.location.assign(next);
        } else {
          setMessage("Account created! If email confirmation is enabled, check your inbox.");
        }
      } else {
        // Sign In
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) throw signInError;

        if (data.session) {
          window.location.assign(getNextPath());
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <style>{`
        .login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#FAF7F2;color:#1A1A1A;padding:24px;font-family:Outfit,system-ui,sans-serif}
        .login-card{width:100%;max-width:440px;background:#FFFFFF;border:1px solid #EAE3D5;border-radius:24px;padding:34px;box-shadow:0 24px 80px rgba(0,0,0,.08)}
        .login-logo{display:flex;align-items:center;gap:12px;justify-content:center;margin-bottom:22px}
        .login-gem{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#3c2880,#c8a030);display:grid;place-items:center;box-shadow:0 0 28px rgba(200,160,48,.28);color:#FAF7F2;font-size:20px}
        .login-brand{font-family:Cormorant Garamond,Georgia,serif;font-size:28px;color:#c8a030;font-weight:700}
        .login-title{font-family:Cormorant Garamond,Georgia,serif;font-size:32px;line-height:1.15;text-align:center;margin:0 0 6px;color:#1A1A1A}
        .login-sub{font-size:13.5px;color:#6B635B;text-align:center;line-height:1.6;margin:0 0 20px}

        .login-button{width:100%;height:48px;border-radius:12px;border:1px solid #261f50;background:rgba(255,255,255,.04);color:#1A1A1A;font-weight:600;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:all .2s ease}
        .login-button:hover:not(:disabled){border-color:#c8a030;background:rgba(200,160,48,.08)}
        .login-button:disabled{opacity:.55;cursor:not-allowed}
        .login-button.google{background:#FFFFFF;border:1px solid #D6CEBE;color:#1A1A1A}
        .login-button.google:hover:not(:disabled){border-color:#c8a030;background:#FCFAF7;box-shadow:0 4px 12px rgba(200,160,48,.12)}
        .login-button.primary{background:linear-gradient(135deg,#c8a030,#a07820);border-color:#c8a030;color:#FAF7F2}
        .login-button.primary:hover:not(:disabled){box-shadow:0 4px 16px rgba(200,160,48,.35)}

        .login-divider{display:flex;align-items:center;margin:20px 0;color:#9E9689;font-size:11px;letter-spacing:.08em;text-transform:uppercase}
        .login-divider::before,.login-divider::after{content:'';flex:1;height:1px;background:#EAE3D5}
        .login-divider span{padding:0 12px}

        .method-tabs{display:flex;background:#F4EFE6;border-radius:10px;padding:3px;margin-bottom:16px;gap:3px}
        .method-tab{flex:1;padding:7px;border-radius:8px;border:none;background:transparent;color:#6B635B;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s ease}
        .method-tab.active{background:#FFFFFF;color:#1A1A1A;box-shadow:0 2px 6px rgba(0,0,0,.06)}

        .login-input-group{margin-bottom:14px}
        .login-label{display:block;font-size:12px;font-weight:600;color:#4A4238;margin-bottom:5px}
        .login-input{width:100%;height:44px;border-radius:10px;border:1px solid #D6CEBE;background:#FAF7F2;padding:0 14px;font-size:14px;color:#1A1A1A;outline:none;transition:border-color .15s ease}
        .login-input:focus{border-color:#c8a030;background:#FFFFFF}

        .remember-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;font-size:12px;color:#6B635B}
        .remember-row label{display:flex;align-items:center;gap:6px;cursor:pointer}
        .remember-row input[type="checkbox"]{accent-color:#c8a030}

        .login-error,.login-message{font-size:13px;line-height:1.5;border-radius:10px;padding:10px 12px;margin-bottom:14px}
        .login-error{color:#b91c1c;background:#fef2f2;border:1px solid #fecaca}
        .login-message{color:#15803d;background:#f0fdf4;border:1px solid #bbf7d0}
        .login-footer{margin-top:20px;padding-top:16px;border-top:1px solid #EAE3D5;text-align:center;font-size:12px;color:#6B635B}
        .login-footer a{color:#c8a030;text-decoration:none}
      `}</style>

      <section className="login-card">
        <div className="login-logo">
          <div className="login-gem">✦</div>
          <div className="login-brand">AstroLife</div>
        </div>

        <h1 className="login-title">Welcome to AstroLife</h1>
        <p className="login-sub">Sign in to access your Vedic charts, personal transit analysis, and AI astrologer.</p>

        {error && <div className="login-error">{error}</div>}
        {message && <div className="login-message">{message}</div>}

        {/* 1. Google 1-Click Login */}
        <button className="login-button google" type="button" onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className="login-divider">
          <span>or sign in with email</span>
        </div>

        {/* Email Method Selector Tabs */}
        <div className="method-tabs">
          <button
            type="button"
            className={`method-tab ${authMethod === "otp" ? "active" : ""}`}
            onClick={() => { setAuthMethod("otp"); setError(""); }}
          >
            Email Code (OTP)
          </button>
          <button
            type="button"
            className={`method-tab ${authMethod === "password" ? "active" : ""}`}
            onClick={() => { setAuthMethod("password"); setError(""); }}
          >
            Email + Password
          </button>
        </div>

        {/* METHOD A: Passwordless Email OTP */}
        {authMethod === "otp" && (
          !otpSent ? (
            <form onSubmit={handleSendOtp}>
              <div className="login-input-group">
                <label className="login-label" htmlFor="otp-email">Email Address</label>
                <input
                  id="otp-email"
                  type="email"
                  className="login-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="remember-row">
                <label>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Stay signed in
                </label>
              </div>

              <button className="login-button primary" type="submit" disabled={loading}>
                {loading ? "Sending Code..." : "Send Login Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div className="login-input-group">
                <label className="login-label" htmlFor="otp-code">6-Digit Code sent to {email}</label>
                <input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  className="login-input"
                  placeholder="123456"
                  maxLength={8}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <button className="login-button primary" type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>

              <button
                type="button"
                onClick={() => { setOtpSent(false); setOtpCode(""); }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#c8a030",
                  fontSize: "12px",
                  display: "block",
                  margin: "12px auto 0",
                  cursor: "pointer",
                }}
              >
                ← Use a different email or resend
              </button>
            </form>
          )
        )}

        {/* METHOD B: Email + Password */}
        {authMethod === "password" && (
          <form onSubmit={handlePasswordAuth}>
            <div className="login-input-group">
              <label className="login-label" htmlFor="pwd-email">Email Address</label>
              <input
                id="pwd-email"
                type="email"
                className="login-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <label className="login-label" htmlFor="pwd-pass">Password</label>
              <input
                id="pwd-pass"
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="remember-row">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Stay signed in
              </label>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                style={{ background: "transparent", border: "none", color: "#c8a030", fontSize: "12px", cursor: "pointer" }}
              >
                {isSignUp ? "Already have account? Sign in" : "Need an account? Sign up"}
              </button>
            </div>

            <button className="login-button primary" type="submit" disabled={loading}>
              {loading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In with Password")}
            </button>
          </form>
        )}

        <div className="login-footer">
          <Link href="/">Back home</Link>
          {" · "}
          <Link href="/privacy">Privacy</Link>
          {" · "}
          <Link href="/terms">Terms</Link>
        </div>
      </section>
    </main>
  );
}
