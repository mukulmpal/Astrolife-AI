"use client";

import React from "react";
import Link from "next/link";
import { X, Sparkles, Crown, Gem, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
  featureDescription?: string;
}

export default function ProUpgradePromptModal({
  isOpen,
  onClose,
  featureTitle = "Outer Planets & Advanced Systems",
  featureDescription = "INDRA (Uranus), VARUN (Neptune), YAM (Pluto), Nirayana Bhava Chalit & KP Cuspal are premium astrological intelligence layers.",
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(18, 14, 28, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAF8F5 100%)",
          borderRadius: "20px",
          border: "1.5px solid rgba(184, 134, 11, 0.35)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 20px rgba(184, 134, 11, 0.15)",
          overflow: "hidden",
          position: "relative",
          animation: "modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header Ribbon */}
        <div
          style={{
            background: "linear-gradient(135deg, #1C1917 0%, #292524 100%)",
            padding: "20px 24px",
            color: "#FFFFFF",
            position: "relative",
            borderBottom: "1px solid rgba(184, 134, 11, 0.3)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#E7E5E4",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(184, 134, 11, 0.2)", padding: "3px 10px", borderRadius: "999px", border: "1px solid rgba(184, 134, 11, 0.4)", marginBottom: "10px" }}>
            <Sparkles size={12} color="#F59E0B" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#F59E0B", letterSpacing: "1px", textTransform: "uppercase" }}>
              Premium Astrology Intelligence
            </span>
          </div>

          <h3 style={{ fontSize: "19px", fontWeight: 800, margin: 0, color: "#FAF5FF", fontFamily: "Cinzel, serif" }}>
            Unlock Pro &amp; Elite Access
          </h3>
          <p style={{ fontSize: "12.5px", color: "#D6D3D1", margin: "6px 0 0", lineHeight: 1.5 }}>
            {featureTitle} is reserved for Astrolife Pro &amp; Elite members.
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontSize: "13px", color: "#44403C", margin: "0 0 16px", lineHeight: 1.6 }}>
            {featureDescription}
          </p>

          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(184, 134, 11, 0.2)",
              borderRadius: "12px",
              padding: "14px",
              marginBottom: "18px",
              display: "grid",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <CheckCircle2 size={16} color="#B8860B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "12px", color: "#292524" }}>
                <strong>Modern Outer Planets (⚡ Indra, 🌊 Varun, 🌋 Yam):</strong> Real ephemeris coordinates, retrograde loops, Robert Hand timing &amp; psychological synthesis.
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <CheckCircle2 size={16} color="#B8860B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "12px", color: "#292524" }}>
                <strong>Nirayana Bhava Chalit:</strong> Exact unequal house boundaries, bhava madhya, and planetary degree shifts.
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <CheckCircle2 size={16} color="#B8860B" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "12px", color: "#292524" }}>
                <strong>KP Cuspal Engine:</strong> Placidus sub-lords, house promise analyzer, and transit confirmation.
              </div>
            </div>
          </div>

          {/* Action CTAs: Pro vs Elite */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Link
              href="/dashboard/upgrade"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #B8860B 0%, #D4AF37 100%)",
                color: "#FFFFFF",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "13px",
                boxShadow: "0 4px 12px rgba(184, 134, 11, 0.25)",
                textAlign: "center",
                gap: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Crown size={15} />
                <span>Upgrade to Pro 👑</span>
              </div>
              <span style={{ fontSize: "10px", opacity: 0.9, fontWeight: 500 }}>Outer Planets &amp; Full Charts</span>
            </Link>

            <Link
              href="/dashboard/upgrade"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 14px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)",
                color: "#FFFFFF",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "13px",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
                textAlign: "center",
                gap: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Gem size={15} />
                <span>Upgrade to Elite 💎</span>
              </div>
              <span style={{ fontSize: "10px", opacity: 0.9, fontWeight: 500 }}>Unlimited AI, Transits &amp; Vastu</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
