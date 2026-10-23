"use client";

import { Trash2, X, AlertTriangle } from "lucide-react";

type Props = {
  isOpen: boolean;
  chartName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

export default function DeleteChartModal({
  isOpen,
  chartName,
  onClose,
  onConfirm,
  isDeleting,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(10, 10, 10, 0.65)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#FFFFFF",
          borderRadius: "18px",
          border: "1px solid rgba(220, 38, 38, 0.25)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          animation: "modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{
            padding: "20px 24px 16px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(220, 38, 38, 0.1)",
              color: "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} />
          </div>

          <div style={{ flex: 1 }}>
            <h3
              className="serif"
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "#1A1A1A",
                margin: "0 0 6px",
              }}
            >
              Delete Saved Chart?
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "#6B635B",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Are you sure you want to delete <strong style={{ color: "#1A1A1A" }}>{chartName}</strong>&apos;s chart from your account? This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{
              background: "transparent",
              border: 0,
              color: "#6B635B",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "14px 24px",
            background: "#FAF8F5",
            borderTop: "1px solid rgba(184, 134, 11, 0.12)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{
              padding: "9px 15px",
              borderRadius: "8px",
              background: "#FFFFFF",
              border: "1px solid rgba(184, 134, 11, 0.25)",
              color: "#4A4238",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "9px 18px",
              borderRadius: "8px",
              background: "#DC2626",
              border: 0,
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "13px",
              cursor: isDeleting ? "wait" : "pointer",
              boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)",
            }}
          >
            <Trash2 size={14} />
            {isDeleting ? "Deleting..." : "Delete Chart"}
          </button>
        </div>
      </div>
    </div>
  );
}
