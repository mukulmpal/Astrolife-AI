"use client";

import React, { useState } from "react";

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutButtonProps {
  amount?: number; // in paise (e.g. 100 = ₹1.00, 50000 = ₹500.00)
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
  amount = 10000, // ₹100.00
  currency = "INR",
  receipt,
  notes,
  name = "AstroLife AI",
  description = "AstroLife Premium Services",
  prefill,
  buttonText = "Pay with Razorpay",
  className = "",
  onSuccess,
  onFailure,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = async () => {
    setStatusMessage(null);
    setIsSuccess(false);
    setLoading(true);

    try {
      // 1. Ensure SDK script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        const errMsg = "Failed to load Razorpay checkout SDK. Please check your internet connection.";
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
        const errMsg = orderData.error || "Unable to initiate payment order.";
        setStatusMessage(errMsg);
        onFailure?.(errMsg);
        setLoading(false);
        return;
      }

      // 3. Configure Razorpay modal options
      const keyId =
        orderData.key_id ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        "rzp_test_Tx0cQSnrukaAgZ";

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name,
        description,
        order_id: orderData.order_id,
        prefill: {
          name: prefill?.name || "",
          email: prefill?.email || "",
          contact: prefill?.contact || "",
        },
        theme: {
          color: "#c8a030", // AstroLife gold theme
        },
        handler: async (response: RazorpaySuccessResponse) => {
          setStatusMessage("Payment received. Verifying signature...");

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
              setStatusMessage("Payment verified successfully!");
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
            const errMsg = error.message || "Failed to contact payment verification endpoint.";
            setStatusMessage(errMsg);
            onFailure?.(errMsg);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            const cancelMsg = "Payment was cancelled.";
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
        const errMsg = failure?.error?.description || "Payment failed. Please try again.";
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
    "inline-flex items-center justify-center font-medium rounded-xl px-6 py-3 transition-all duration-200 shadow-md bg-amber-500 hover:bg-amber-600 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={className || defaultClasses}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-current"
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
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          buttonText
        )}
      </button>

      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`text-sm px-3 py-2 rounded-lg border ${
            isSuccess
              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
              : statusMessage.includes("cancelled")
              ? "bg-amber-950/40 border-amber-500/40 text-amber-300"
              : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
