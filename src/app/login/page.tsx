"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"init" | "otp">("init");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  // Google Login
  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError("Valid phone number daalo");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
    });
    if (error) setError(error.message);
    else setStep("otp");
    setLoading(false);
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setError("OTP daalo");
      return;
    }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token: otp,
      type: "sms",
    });
    if (error) setError(error.message);
    else window.location.href = "/dashboard";
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#060410; font-family:'Outfit',sans-serif; min-height:100vh; }

        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        /* Background orbs */
        .orb1 {
          position:absolute; width:600px; height:600px; border-radius:50%;
          background:radial-gradient(circle,rgba(60,40,128,0.2) 0%,transparent 65%);
          top:-150px; left:-150px; pointer-events:none;
        }
        .orb2 {
          position:absolute; width:400px; height:400px; border-radius:50%;
          background:radial-gradient(circle,rgba(200,160,48,0.1) 0%,transparent 65%);
          bottom:-100px; right:-100px; pointer-events:none;
        }
        .ring {
          position:absolute; border-radius:50%; border:1px solid rgba(200,160,48,0.04);
          top:50%; left:50%; transform:translate(-50%,-50%); pointer-events:none;
        }
        .r1 { width:500px; height:500px; animation:spin 80s linear infinite; }
        .r2 { width:700px; height:700px; border-color:rgba(60,40,128,0.04); animation:spin 120s linear infinite reverse; }
        @keyframes spin { to{transform:translate(-50%,-50%) rotate(360deg)} }

        /* Card */
        .card {
          position: relative; z-index:1;
          width: 100%; max-width: 420px;
          background: rgba(13,10,34,0.95);
          border: 1px solid #1c1840;
          border-radius: 24px;
          padding: 48px 40px;
          backdrop-filter: blur(20px);
          animation: fadeUp 0.8s ease both;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        /* Logo */
        .logo {
          display: flex; align-items:center; gap:12px;
          justify-content: center; margin-bottom: 32px;
        }
        .logo-gem {
          width:40px; height:40px; border-radius:10px;
          background:linear-gradient(135deg,#3c2880,#c8a030);
          display:flex; align-items:center; justify-content:center;
          font-size:18px;
          box-shadow: 0 0 24px rgba(200,160,48,0.3);
        }
        .logo-name {
          font-family:'Cormorant Garamond',serif;
          font-size:24px; font-weight:600;
          background:linear-gradient(135deg,#c8a030,#f0d898);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
        }

        /* Heading */
        .heading {
          font-family:'Cormorant Garamond',serif;
          font-size:32px; font-weight:600;
          color:#f0e8d0; text-align:center;
          line-height:1.2; margin-bottom:8px;
        }
        .heading em { font-style:italic; color:#c8a030; }
        .subheading {
          font-size:14px; color:#605890;
          text-align:center; margin-bottom:36px;
          line-height:1.6;
        }

        /* Divider */
        .divider {
          display:flex; align-items:center; gap:12px;
          margin-bottom:24px;
        }
        .divider-line { flex:1; height:1px; background:#1c1840; }
        .divider-text { font-size:11px; color:#605890; letter-spacing:1px; }

        /* Google Button */
        .btn-google {
          width:100%; padding:14px;
          background:rgba(255,255,255,0.04);
          border:1px solid #261f50;
          border-radius:12px;
          display:flex; align-items:center; justify-content:center; gap:12px;
          font-size:14px; font-weight:500; color:#f0e8d0;
          cursor:pointer; transition:all 0.25s;
          font-family:'Outfit',sans-serif;
          margin-bottom:24px;
        }
        .btn-google:hover {
          background:rgba(255,255,255,0.08);
          border-color:#3c2880;
          transform:translateY(-2px);
        }
        .google-icon {
          width:20px; height:20px; flex-shrink:0;
        }

        /* Input */
        .input-label {
          font-size:11px; letter-spacing:1.5px; text-transform:uppercase;
          color:#605890; margin-bottom:8px; display:block;
        }
        .input-wrap {
          display:flex; align-items:center;
          background:rgba(255,255,255,0.03);
          border:1px solid #1c1840;
          border-radius:12px; overflow:hidden;
          margin-bottom:16px;
          transition:border-color 0.2s;
        }
        .input-wrap:focus-within { border-color:#c8a030; }
        .input-prefix {
          padding:0 14px; font-size:14px; color:#605890;
          border-right:1px solid #1c1840;
          height:50px; display:flex; align-items:center;
          flex-shrink:0;
        }
        .input {
          flex:1; height:50px; padding:0 16px;
          background:transparent; border:none; outline:none;
          font-size:15px; color:#f0e8d0;
          font-family:'Outfit',sans-serif;
        }
        .input::placeholder { color:#3a3060; }
        .input-full {
          width:100%; height:50px; padding:0 16px;
          background:rgba(255,255,255,0.03);
          border:1px solid #1c1840;
          border-radius:12px; outline:none;
          font-size:18px; color:#f0e8d0;
          font-family:'Outfit',sans-serif;
          letter-spacing:8px; text-align:center;
          transition:border-color 0.2s;
          margin-bottom:16px;
        }
        .input-full:focus { border-color:#c8a030; }
        .input-full::placeholder { letter-spacing:2px; font-size:14px; }

        /* Primary Button */
        .btn-primary {
          width:100%; padding:15px;
          background:linear-gradient(135deg,#c8a030,#3c2880cc);
          border:none; border-radius:12px;
          font-size:15px; font-weight:600; color:#060410;
          cursor:pointer; transition:all 0.25s;
          font-family:'Outfit',sans-serif;
          display:flex; align-items:center; justify-content:center; gap:8px;
        }
        .btn-primary:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:0 12px 32px rgba(200,160,48,0.3);
          filter:brightness(1.08);
        }
        .btn-primary:disabled { opacity:0.5; cursor:not-allowed; }

        /* Back link */
        .back-link {
          text-align:center; margin-top:16px;
          font-size:13px; color:#605890;
          cursor:pointer; transition:color 0.2s;
        }
        .back-link:hover { color:#c8a030; }

        /* Error */
        .error {
          background:rgba(220,50,50,0.1);
          border:1px solid rgba(220,50,50,0.2);
          border-radius:8px; padding:10px 14px;
          font-size:13px; color:#ff8080;
          margin-bottom:16px; text-align:center;
        }

        /* Footer */
        .card-footer {
          margin-top:28px; padding-top:20px;
          border-top:1px solid #1c1840;
          text-align:center;
          font-size:12px; color:#3a3060; line-height:1.7;
        }
        .card-footer a { color:#605890; cursor:pointer; transition:color 0.2s; }
        .card-footer a:hover { color:#c8a030; }

        /* Back to home */
        .home-link {
          position:absolute; top:24px; left:24px; z-index:10;
          display:flex; align-items:center; gap:8px;
          font-size:13px; color:#605890;
          cursor:pointer; transition:color 0.2s;
          text-decoration:none;
        }
        .home-link:hover { color:#c8a030; }

        @media(max-width:480px) {
          .card { padding:36px 24px; }
          .heading { font-size:26px; }
        }
      `}</style>

      <div className="page">
        <div className="orb1" /><div className="orb2" />
        <div className="ring r1" /><div className="ring r2" />

        {/* Back to home */}
        <Link href="/" className="home-link">← Home</Link>

        <div className="card">
          {/* Logo */}
          <div className="logo">
            <div className="logo-gem">✦</div>
            <span className="logo-name">AstroLife</span>
          </div>

          {step === "init" ? (
            <>
              <h1 className="heading">
                Begin Your<br /><em>Cosmic Journey</em>
              </h1>
              <p className="subheading">
                Sign in to access your personal<br />AI astrology universe
              </p>

              {/* Error */}
              {error && <div className="error">{error}</div>}

              {/* Google */}
              <button className="btn-google" onClick={handleGoogle} disabled={loading}>
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">OR</span>
                <div className="divider-line" />
              </div>

              {/* Phone Input */}
              <label className="input-label">Phone Number</label>
              <div className="input-wrap">
                <div className="input-prefix">🇮🇳 +91</div>
                <input
                  className="input"
                  type="tel"
                  placeholder="Enter 10-digit number"
                  maxLength={10}
                  value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g,"")); setError(""); }}
                />
              </div>

              <button
                className="btn-primary"
                onClick={handleSendOtp}
                disabled={loading || phone.length < 10}
              >
                {loading ? "Sending..." : "Send OTP ✦"}
              </button>
            </>
          ) : (
            <>
              <h1 className="heading">
                Enter Your<br /><em>Sacred Code</em>
              </h1>
              <p className="subheading">
                OTP sent to +91 {phone}<br />
                Check your messages
              </p>

              {error && <div className="error">{error}</div>}

              <label className="input-label">Enter OTP</label>
              <input
                className="input-full"
                type="tel"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g,"")); setError(""); }}
              />

              <button
                className="btn-primary"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length < 4}
              >
                {loading ? "Verifying..." : "Verify & Enter ✦"}
              </button>

              <div className="back-link" onClick={() => { setStep("init"); setOtp(""); setError(""); }}>
                ← Change number
              </div>
            </>
          )}

          {/* Footer */}
          <div className="card-footer">
            By continuing you agree to our{" "}
            <a>Terms of Service</a> and{" "}
            <a>Privacy Policy</a>
          </div>
        </div>
      </div>
    </>
  );
}
