"use client";

import React, { useState } from "react";
import Link from "next/link";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";

export default function CheckoutPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(100); // 100 paise = ₹1.00
  const [customPaise, setCustomPaise] = useState<string>("100");
  const [customerName, setCustomerName] = useState<string>("Test Customer");
  const [customerEmail, setCustomerEmail] = useState<string>("customer@astrolife.ai");
  const [customerPhone, setCustomerPhone] = useState<string>("9999999999");
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    order_id: string;
    payment_id: string;
  } | null>(null);

  const presets = [
    { label: "₹1 (Test Minimum - 100 paise)", paise: 100 },
    { label: "₹499 (Pro Tier - 49,900 paise)", paise: 49900 },
    { label: "₹1,999 (Elite Tier - 1,99,900 paise)", paise: 199900 },
  ];

  const handleAmountChange = (paise: number) => {
    setSelectedAmount(paise);
    setCustomPaise(String(paise));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto w-full py-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Payment Gateway
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-1">
              Razorpay Standard Checkout
            </h1>
          </div>
          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          <div className="space-y-6">
            {/* Amount selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Test Amount
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                {presets.map((preset) => (
                  <button
                    key={preset.paise}
                    type="button"
                    onClick={() => handleAmountChange(preset.paise)}
                    className={`px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${
                      selectedAmount === preset.paise
                        ? "border-amber-400 bg-amber-400/10 text-amber-300"
                        : "border-slate-800 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-400">Custom amount (in paise):</span>
                <input
                  type="number"
                  min="100"
                  value={customPaise}
                  onChange={(e) => {
                    setCustomPaise(e.target.value);
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setSelectedAmount(val);
                  }}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm text-white w-32 focus:outline-none focus:border-amber-400"
                />
                <span className="text-xs text-slate-400">
                  = ₹{(selectedAmount / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Total Payable Amount</div>
                <div className="text-2xl font-bold text-amber-400">
                  ₹{(selectedAmount / 100).toFixed(2)}
                </div>
              </div>
              <div className="text-right text-xs text-slate-400">
                <div>Currency: <span className="text-slate-200">INR</span></div>
                <div>Amount in paise: <span className="text-slate-200">{selectedAmount}</span></div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="pt-2">
              <RazorpayCheckoutButton
                amount={selectedAmount}
                currency="INR"
                name="AstroLife AI"
                description={`Order payment of ₹${(selectedAmount / 100).toFixed(2)}`}
                buttonText={`Pay ₹${(selectedAmount / 100).toFixed(2)} with Razorpay`}
                prefill={{
                  name: customerName,
                  email: customerEmail,
                  contact: customerPhone,
                }}
                onSuccess={(data) => {
                  setPaymentSuccessData({
                    order_id: data.order_id,
                    payment_id: data.payment_id,
                  });
                }}
                onFailure={() => {
                  setPaymentSuccessData(null);
                }}
              />
            </div>

            {/* Payment Success Details */}
            {paymentSuccessData && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-emerald-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Payment Verified & Completed!
                </div>
                <div className="text-xs font-mono bg-slate-950/60 p-3 rounded-lg border border-emerald-900/60 space-y-1">
                  <div>Order ID: <span className="text-white">{paymentSuccessData.order_id}</span></div>
                  <div>Payment ID: <span className="text-white">{paymentSuccessData.payment_id}</span></div>
                  <div>Status: <span className="text-emerald-400 font-bold">HMAC-SHA256 SIGNATURE MATCHED</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Integration Architecture info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">1. Create Order</span>
            Calls <code className="text-amber-400">/api/create-order</code> with amount, currency, receipt. Validates ≥ 100 paise.
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">2. Modal Checkout</span>
            Opens Razorpay Standard modal using checkout.js with test key <code className="text-amber-400">rzp_test_...</code>.
          </div>
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <span className="font-semibold text-slate-200 block mb-1">3. Verify Signature</span>
            Calls <code className="text-amber-400">/api/verify-payment</code>, verifying HMAC-SHA256(order_id|payment_id).
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-600 py-4">
        AstroLife AI • Razorpay Test Mode Integration
      </footer>
    </div>
  );
}
