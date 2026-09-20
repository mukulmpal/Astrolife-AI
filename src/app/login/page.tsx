"use client";

import Link from "next/link";
import { useState } from "react";

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

  const handleGoogle = () => {
    setError("");
    setMessage("");
    setLoading(true);
    const next = getNextPath();
    window.location.assign(`/auth/google?next=${encodeURIComponent(next)}`);
  };

  return (
    <main className="login-page">
      <style>{`
        .login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#060410;color:#f0e8d0;padding:24px;font-family:Outfit,system-ui,sans-serif}
        .login-card{width:100%;max-width:440px;background:#0d0a22;border:1px solid #1c1840;border-radius:22px;padding:34px;box-shadow:0 24px 80px rgba(0,0,0,.35)}
        .login-logo{display:flex;align-items:center;gap:12px;justify-content:center;margin-bottom:26px}
        .login-gem{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#3c2880,#c8a030);display:grid;place-items:center;box-shadow:0 0 28px rgba(200,160,48,.28)}
        .login-brand{font-family:Cormorant Garamond,Georgia,serif;font-size:28px;color:#c8a030;font-weight:700}
        .login-title{font-family:Cormorant Garamond,Georgia,serif;font-size:34px;line-height:1.1;text-align:center;margin:0 0 8px}
        .login-sub{font-size:14px;color:#a79fbd;text-align:center;line-height:1.7;margin:0 0 24px}
        .login-button{width:100%;height:50px;border-radius:12px;border:1px solid #261f50;background:rgba(255,255,255,.04);color:#f0e8d0;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px}
        .login-button:hover:not(:disabled){border-color:#c8a030;background:rgba(200,160,48,.08)}
        .login-button:disabled{opacity:.55;cursor:not-allowed}
        .login-button.primary{background:linear-gradient(135deg,#c8a030,#a07820);border-color:#c8a030;color:#060410}
        .login-note{font-size:12px;line-height:1.65;color:#a79fbd;background:rgba(200,160,48,.06);border:1px solid rgba(200,160,48,.16);border-radius:12px;padding:12px;margin-bottom:14px}
        .login-error,.login-message{font-size:13px;line-height:1.6;border-radius:10px;padding:10px 12px;margin-bottom:14px}
        .login-error{color:#fca5a5;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.18)}
        .login-message{color:#86efac;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.16)}
        .login-footer{margin-top:24px;padding-top:18px;border-top:1px solid #1c1840;text-align:center;font-size:12px;color:#605890}
        .login-footer a{color:#c8a030;text-decoration:none}
      `}</style>

      <section className="login-card">
        <div className="login-logo">
          <div className="login-gem">✦</div>
          <div className="login-brand">AstroLife</div>
        </div>

        <h1 className="login-title">Sign in to AstroLife</h1>
        <p className="login-sub">Continue with your Google account to access your saved charts and birth profile.</p>

        {error && <div className="login-error">{error}</div>}
        {message && <div className="login-message">{message}</div>}

        <div className="login-note">
          We only support Google sign-in for this product so onboarding and saved charts stay consistent for each account.
        </div>

        <button className="login-button primary" type="button" onClick={handleGoogle} disabled={loading}>
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

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
