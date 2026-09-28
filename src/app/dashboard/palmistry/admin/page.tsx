import Link from "next/link";

export default function PalmistryAdminPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-8 text-[#1A1A1A] md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#B8860B]">
          AstroLife Palmistry Admin
        </p>

        <h1 className="mt-3 text-3xl font-bold text-[#1A1A1A] md:text-5xl font-serif">
          Palmistry Engine Control
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#6B635B]">
          Review feedback-driven quality signals before manually approving rule
          confidence or priority changes.
        </p>

        <Link
          href="/dashboard/palmistry/admin/tuning"
          className="mt-6 inline-flex rounded-xl border border-[rgba(184,134,11,0.25)] px-4 py-3 text-sm font-semibold text-[#1A1A1A] hover:bg-[#FAF5EB]"
        >
          View Confidence Tuning
        </Link>
      </div>
    </main>
  );
}
