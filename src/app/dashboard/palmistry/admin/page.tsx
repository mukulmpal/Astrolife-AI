import Link from "next/link";

export default function PalmistryAdminPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-300/70">
          AstroLife Palmistry Admin
        </p>

        <h1 className="mt-3 text-3xl font-bold text-amber-100 md:text-5xl">
          Palmistry Engine Control
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
          Review feedback-driven quality signals before manually approving rule
          confidence or priority changes.
        </p>

        <Link
          href="/dashboard/palmistry/admin/tuning"
          className="mt-6 inline-flex rounded-xl border border-amber-400/30 px-4 py-3 text-sm font-semibold text-amber-100 hover:bg-amber-400/10"
        >
          View Confidence Tuning
        </Link>
      </div>
    </main>
  );
}
