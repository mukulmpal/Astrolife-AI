"use client";

import React, { useState } from "react";

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutButtonProps {
  amount?: number; // in paise (e.g. 100 = ₹1.00, 49900 = ₹499.00)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  buttonText?: string;
  className?: string;
  onSuccess?: (verifyResult: {
    success: boolean;
    order_id: string;
    payment_id: string;
  }) => void;
  onFailure?: (errorMessage: string) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayCheckoutButton({
  amount = 10000,
  currency = "INR",
  receipt,
  notes,
  name = "AstroLife AI",
  description = "AstroLife Cosmic Access",
  prefill,
  buttonText,
  className = "",
  onSuccess,
  onFailure,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const displayPrice = `₹${(amount / 100).toLocaleString("en-IN")}`;
  const defaultLabel = buttonText || `Proceed with Payment • ${displayPrice}`;

  const handleCheckout = async () => {
    setStatusMessage(null);
    setIsSuccess(false);
    setLoading(true);

    try {
      // 1. Ensure SDK script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        const errMsg = "Payment window load nahi ho paya. Kripya internet connection check karein.";
        setStatusMessage(errMsg);
        onFailure?.(errMsg);
        setLoading(false);
        return;
      }

      // 2. Call backend /api/create-order
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          receipt,
          notes,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order_id) {
        const errMsg = orderData.error || "Order generate nahi ho paya. Please retry karein.";
        setStatusMessage(errMsg);
        onFailure?.(errMsg);
        setLoading(false);
        return;
      }

      // 3. Configure Razorpay modal options
      const keyId =
        orderData.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        "rzp_live_Tx0owKqxOHnX2U";

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name,
        description,
        order_id: orderData.order_id,
        image: "/logo.png",
        prefill: {
          name: prefill?.name || "",
          email: prefill?.email || "",
          contact: prefill?.contact || "",
        },
        theme: {
          color: "#c8a030", // AstroLife signature gold
          backdrop_color: "rgba(26, 26, 26, 0.8)",
        },
        handler: async (response: RazorpaySuccessResponse) => {
          setStatusMessage("Payment received. Cosmic verification in progress...");

          try {
            // 4. Send payment details to /api/verify-payment
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setIsSuccess(true);
              setStatusMessage("✦ Payment verified successfully! Your cosmic tier is unlocked.");
              onSuccess?.({
                success: true,
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
              });
            } else {
              const errMsg = verifyData.error || "Payment verification failed.";
              setStatusMessage(errMsg);
              onFailure?.(errMsg);
            }
          } catch (err: unknown) {
            const error = err as Error;
            const errMsg = error.message || "Failed to reach verification service.";
            setStatusMessage(errMsg);
            onFailure?.(errMsg);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            const cancelMsg = "Payment cancel kar diya gaya. Aap jab chahein tab retry kar sakte hain.";
            setStatusMessage(cancelMsg);
            onFailure?.(cancelMsg);
            setLoading(false);
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);

      // Handle payment failure event
      rzpInstance.on("payment.failed", (failResponse: unknown) => {
        const failure = failResponse as {
          error?: { description?: string; code?: string; reason?: string };
        };
        console.error("Razorpay payment failed:", failure?.error);
        const errMsg = failure?.error?.description || "Payment process fail ho gaya. Please try again.";
        setStatusMessage(errMsg);
        onFailure?.(errMsg);
        setLoading(false);
      });

      rzpInstance.open();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Razorpay checkout error:", error);
      const errMsg = error.message || "An unexpected error occurred during checkout.";
      setStatusMessage(errMsg);
      onFailure?.(errMsg);
      setLoading(false);
    }
  };

  const defaultClasses =
    "w-full py-4 px-6 rounded-xl font-semibold text-[15px] tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_6px_20px_rgba(200,160,48,0.35)] hover:shadow-[0_10px_28px_rgba(200,160,48,0.5)] hover:-translate-y-0.5 active:translate-y-0 text-[#FAF7F2] bg-gradient-to-r from-[#c8a030] to-[#a07820]";

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={className || defaultClasses}
      >
        {loading ? (
          <span className="flex items-center gap-2.5">
            <svg
              className="animate-spin h-5 w-5 text-[#FAF7F2]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Processing Cosmic Order...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <span>✦</span>
            <span>{defaultLabel}</span>
          </span>
        )}
      </button>

      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`text-xs sm:text-sm px-4 py-3 rounded-xl border transition-all ${
            isSuccess
              ? "bg-[#16a34a]/10 border-[#16a34a]/40 text-[#16a34a] font-medium"
              : statusMessage.includes("cancel")
              ? "bg-[#c8a030]/10 border-[#c8a030]/40 text-[#a07820]"
              : "bg-red-500/10 border-red-500/30 text-red-600"
          }`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
