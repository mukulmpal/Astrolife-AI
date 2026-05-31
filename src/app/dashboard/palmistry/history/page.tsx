import { PalmistryHistoryList } from "@/components/palmistry/palmistry-history-list";

export default function PalmistryHistoryPage() {
  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.35em] text-amber-300/70">AstroLife Palmistry</p>
        <h1 className="mt-3 text-3xl font-bold text-amber-100 md:text-5xl">Palm Report History</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          View saved palm reports, fusion insights and future rescan comparisons.
        </p>
        <div className="mt-8">
          <PalmistryHistoryList />
        </div>
      </section>
    </main>
  );
}
