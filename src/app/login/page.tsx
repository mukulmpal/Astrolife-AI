"use client";

import Link from "next/link";
import { useState } from "react";

const PHONE_OTP_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_PHONE_OTP === "true" ||
  process.env.ENABLE_PHONE_OTP === "true";

function normalizePhone(value: string) {
  const cleaned = value.trim().replace(/[^\d+]/g, "");
  if (cleaned.startsWith("+")) return cleaned;
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return null;
}

function getNextPath() {
  if (typeof window === "undefined") return "/dashboard";
  const next = new URLSearchParams(window.location.search).get("next");
  return next?.startsWith("/") ? next : "/dashboard";
}

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState<"google" | "phone" | "verify" | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Surface any error passed as a query param (e.g. from the OAuth callback)
  // so the user sees why sign in failed instead of looping silently.
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err && !error) setError(decodeURIComponent(err));
    const msg = params.get("message");
    if (msg && !message) setMessage(decodeURIComponent(msg));
  }

  const handleGoogle = async () => {
    setError("");
    setMessage("");
    setLoading("google");
    const next = getNextPath();
    window.location.assign(`/auth/google?next=${encodeURIComponent(next)}`);
  };

  const handleSendOtp = async () => {
    if (!PHONE_OTP_ENABLED) return;
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      setError("Enter a valid phone number with country code.");
      return;
    }

    setError("");
    setMessage("");
    setLoading("phone");
    const { error: otpError } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
    });
    setLoading(null);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setOtpSent(true);
    setMessage("OTP sent. Enter the code from SMS.");
  };

  const handleVerifyOtp = async () => {
    if (!PHONE_OTP_ENABLED) return;
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone || otp.length < 4) {
      setError("Enter your phone number and OTP.");
      return;
    }

    setError("");
    setMessage("");
    setLoading("verify");
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: otp,
      type: "sms",
    });
    setLoading(null);

    if (verifyError) {
      setError(verifyError.message);
      return;
    }

    window.location.assign(getNextPath());
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
        .login-divider{display:flex;align-items:center;gap:12px;margin:24px 0;color:#605890;font-size:11px;letter-spacing:.18em;text-transform:uppercase}
        .login-divider:before,.login-divider:after{content:"";height:1px;background:#1c1840;flex:1}
        .login-label{display:block;margin:0 0 8px;color:#8f86bd;font-size:11px;letter-spacing:.16em;text-transform:uppercase}
        .login-input{width:100%;height:48px;background:#08051a;border:1px solid #1c1840;border-radius:12px;color:#f0e8d0;padding:0 14px;font:inherit;margin-bottom:12px}
        .login-input:focus{outline:none;border-color:#c8a030}
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
        <p className="login-sub">Google login is active now. Your saved charts stay attached to your private Supabase account.</p>

        {error && <div className="login-error">{error}</div>}
        {message && <div className="login-message">{message}</div>}

        <button className="login-button primary" type="button" onClick={handleGoogle} disabled={loading !== null}>
          {loading === "google" ? "Connecting..." : "Continue with Google"}
        </button>

        <div className="login-divider">Phone OTP</div>

        <div className="login-note">
          Phone OTP requires SMS provider setup and billing in Supabase/Auth provider settings. Google login is active now.
        </div>

        <label className="login-label" htmlFor="phone">Phone number</label>
        <input
          id="phone"
          className="login-input"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+91 98765 43210"
          disabled={!PHONE_OTP_ENABLED || loading !== null}
        />

        {otpSent && (
          <>
            <label className="login-label" htmlFor="otp">OTP</label>
            <input
              id="otp"
              className="login-input"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              placeholder="Enter SMS code"
              disabled={!PHONE_OTP_ENABLED || loading !== null}
            />
          </>
        )}

        <button
          className="login-button"
          type="button"
          onClick={otpSent ? handleVerifyOtp : handleSendOtp}
          disabled={!PHONE_OTP_ENABLED || loading !== null}
        >
          {!PHONE_OTP_ENABLED
            ? "Phone OTP disabled until SMS provider is configured"
            : loading === "phone" || loading === "verify"
              ? "Please wait..."
              : otpSent
                ? "Verify OTP"
                : "Send OTP"}
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
