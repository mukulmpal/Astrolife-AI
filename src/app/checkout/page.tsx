"use client";

import React, { useState } from "react";
import Link from "next/link";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";

export default function CheckoutPage() {
  // Direct ₹1 default plan as requested
  const [selectedPlan, setSelectedPlan] = useState<string>("trial");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    order_id: string;
    payment_id: string;
  } | null>(null);

  const tiers = [
    {
      id: "trial",
      title: "⚡ Instant Test Offering",
      badge: "Direct ₹1",
      price: "₹1",
      paise: 100,
      period: "Instant Access",
      description: "Direct ₹1 sacred offering to verify cosmic activation & gateway link.",
      features: [
        "Direct ₹1 settlement to live account",
        "Instant Order ID & Signature Verification",
        "Full PCI-DSS Level 1 Security",
      ],
      highlight: true,
    },
    {
      id: "pro",
      title: "👑 Pro Kundli Tier",
      badge: "Most Popular",
      price: "₹499",
      paise: 49900,
      period: "/ month",
      description: "Unlimited AI Kundli queries, full Dasha, KP & classical Lal Kitab remedies.",
      features: [
        "Unlimited Cosmic AI Chat across all agents",
        "Full Dasha timeline + Sub-periods (Pratyantar)",
        "Classical Gemstone & Lal Kitab remedies",
        "Watermark-free High Res Kundli PDF exports",
      ],
      highlight: false,
    },
    {
      id: "elite",
      title: "💎 Elite Master Tier",
      badge: "Master Access",
      price: "₹1,999",
      paise: 199900,
      period: "/ month",
      description: "Complete Vedic master suite: D-1 to D-60, Vastu, Sound Therapy & BTR.",
      features: [
        "Everything in Pro Tier included",
        "Divisional Charts (D-1 to D-60 Shodashvarga)",
        "Astro-Vastu compass & GPS alignment",
        "Birth Time Rectification (BTR) engine",
      ],
      highlight: false,
    },
  ];

  const currentTier = tiers.find((t) => t.id === selectedPlan) || tiers[0];
  const payablePaise = currentTier.paise;
  const payableRupees = (payablePaise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1A1A1A] font-sans selection:bg-[#c8a030]/20 selection:text-[#1A1A1A] flex flex-col justify-between">
      {/* Top sacred navigation */}
      <header className="border-b border-[#c8a030]/20 bg-[#FAF7F2]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3c2880] to-[#c8a030] flex items-center justify-center text-[#FAF7F2] text-sm shadow-sm group-hover:scale-105 transition-transform">
              ✦
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A]">
              AstroLife <span className="text-[#c8a030] italic font-normal">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c8a030]/10 text-[#a07820] border border-[#c8a030]/30">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse"></span>
              Live Gateway Active
            </span>
            <Link
              href="/dashboard/upgrade"
              className="text-[#6B635B] hover:text-[#1A1A1A] transition-colors"
            >
              Plans Comparison
            </Link>
            <Link
              href="/dashboard"
              className="text-[#c8a030] hover:text-[#a07820] transition-colors font-semibold"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full">
        {/* Hero header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#c8a030] mb-3">
            <span>✦</span>
            <span>Sacred Gateway • Instant Activation</span>
            <span>✦</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-[#1A1A1A] leading-tight">
            Unlock Your Cosmic <em className="italic text-[#c8a030] font-normal">Destiny</em>
          </h1>
          <p className="mt-3 text-[#6B635B] text-sm sm:text-base leading-relaxed">
            Choose your sacred offering tier below. All transactions are securely processed
            via Razorpay with bank-grade 256-bit encryption.
          </p>
        </div>

        {/* 3-Column Plan Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {tiers.map((tier) => {
            const isSelected = selectedPlan === tier.id;
            return (
              <div
                key={tier.id}
                onClick={() => setSelectedPlan(tier.id)}
                className={`cursor-pointer rounded-2xl p-6 sm:p-7 relative transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#FFFFFF] border-2 border-[#c8a030] shadow-[0_12px_36px_rgba(200,160,48,0.22)] -translate-y-1"
                    : "bg-[#FFFFFF] border border-[#E7DFD5] hover:border-[#c8a030]/50 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#c8a030] to-[#a07820] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-sm">
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-semibold tracking-wider text-[#6B635B]">
                      {tier.title}
                    </span>
                    <input
                      type="radio"
                      name="tier_select"
                      checked={isSelected}
                      onChange={() => setSelectedPlan(tier.id)}
                      className="accent-[#c8a030] w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-serif text-4xl sm:text-5xl font-semibold text-[#1A1A1A]">
                      {tier.price}
                    </span>
                    <span className="text-xs text-[#6B635B] font-medium">{tier.period}</span>
                  </div>

                  <p className="text-xs text-[#6B635B] mb-6 leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="h-[1px] bg-[#E7DFD5] mb-5"></div>

                  <ul className="space-y-2.5 mb-6 text-xs text-[#4A4238]">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#c8a030] text-xs mt-0.5 flex-shrink-0">✦</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <div
                    className={`text-center py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-colors ${
                      isSelected
                        ? "bg-[#c8a030]/15 text-[#a07820] border border-[#c8a030]/40 font-bold"
                        : "bg-[#FAF7F2] text-[#6B635B] border border-[#E7DFD5]"
                    }`}
                  >
                    {isSelected ? "Selected Tier" : "Select Tier"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Card (Customer Details + Gateway Action) */}
        <div className="bg-[#FFFFFF] border border-[#c8a030]/30 rounded-3xl p-6 sm:p-10 shadow-[0_16px_40px_rgba(200,160,48,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Customer details */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#c8a030]">
                  Step 1 • Seeker Information
                </span>
                <h3 className="font-serif text-2xl font-semibold text-[#1A1A1A] mt-1">
                  Contact & Communication Details
                </h3>
                <p className="text-xs text-[#6B635B] mt-1">
                  Payment confirmation receipt and cosmic chart access will be routed to these details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#9C948A] focus:outline-none focus:border-[#c8a030] transition-colors"
                    placeholder="Full Name (e.g. Rahul Sharma)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#9C948A] focus:outline-none focus:border-[#c8a030] transition-colors"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4238] mb-1.5">
                    Mobile Number (UPI/SMS)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-[#E7DFD5] rounded-xl px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-[#9C948A] focus:outline-none focus:border-[#c8a030] transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-[#E7DFD5] grid grid-cols-3 gap-3 text-center text-[11px] text-[#6B635B]">
                <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[#FAF7F2]/80 border border-[#E7DFD5]/60">
                  <span className="text-base">🔒</span>
                  <span className="font-semibold text-[#1A1A1A]">256-Bit SSL</span>
                  <span>Bank-Grade Encryption</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[#FAF7F2]/80 border border-[#E7DFD5]/60">
                  <span className="text-base">⚡</span>
                  <span className="font-semibold text-[#1A1A1A]">Instant Access</span>
                  <span>Zero Manual Waiting</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[#FAF7F2]/80 border border-[#E7DFD5]/60">
                  <span className="text-base">🛡️</span>
                  <span className="font-semibold text-[#1A1A1A]">PCI-DSS Level 1</span>
                  <span>Certified by Razorpay</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order summary & Button */}
            <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E7DFD5] rounded-2xl p-6 sm:p-7 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#c8a030]">
                  Step 2 • Order Summary
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-sm font-semibold text-[#1A1A1A]">
                    {currentTier.title}
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#c8a030]">
                    ₹{payableRupees}
                  </span>
                </div>
                <div className="text-xs text-[#6B635B] mt-1">
                  100% Tax & GST Included • Direct Bank Settlement
                </div>
              </div>

              <div className="h-[1px] bg-[#E7DFD5]"></div>

              <div className="space-y-2 text-xs text-[#6B635B]">
                <div className="flex justify-between">
                  <span>Selected Offering</span>
                  <span className="text-[#1A1A1A] font-medium">₹{payableRupees}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gateway Handling Fee</span>
                  <span className="text-[#16a34a] font-medium">Free (Covered)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E7DFD5] text-sm font-bold text-[#1A1A1A]">
                  <span>Total Payable</span>
                  <span className="text-[#c8a030] font-serif text-xl">₹{payableRupees}</span>
                </div>
              </div>

              {/* Payment Button */}
              <div className="pt-2">
                <RazorpayCheckoutButton
                  amount={payablePaise}
                  currency="INR"
                  name="AstroLife AI"
                  description={`${currentTier.title} • ₹${payableRupees}`}
                  buttonText={`Pay ₹${payableRupees} with Razorpay`}
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

              {/* Success Result Box */}
              {paymentSuccessData && (
                <div className="p-4 rounded-xl bg-[#16a34a]/10 border border-[#16a34a]/30 text-[#16a34a] space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    <span>✦</span>
                    <span>Payment Verified & Account Activated!</span>
                  </div>
                  <div className="text-[11px] font-mono bg-white/80 p-2.5 rounded-lg border border-[#16a34a]/20 text-[#4A4238] space-y-0.5">
                    <div>Order: <span className="font-semibold text-[#1A1A1A]">{paymentSuccessData.order_id}</span></div>
                    <div>Payment: <span className="font-semibold text-[#1A1A1A]">{paymentSuccessData.payment_id}</span></div>
                    <div className="text-[#16a34a] font-semibold">Status: HMAC-SHA256 SIGNATURE VERIFIED</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Sacred Footer */}
      <footer className="border-t border-[#c8a030]/20 bg-[#FAF7F2] py-6 text-center text-xs text-[#6B635B]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[#a07820] font-serif">
            <span>✦</span>
            <span>AstroLife AI • Vedic Astrology & Cosmic Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/privacy" className="hover:text-[#1A1A1A] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#1A1A1A] transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-[#1A1A1A] transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
