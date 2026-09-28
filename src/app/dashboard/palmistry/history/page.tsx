import { PalmistryHistoryList } from "@/components/palmistry/palmistry-history-list";

export default function PalmistryHistoryPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-8 text-[#1A1A1A] md:px-8">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.35em] text-[#B8860B]">AstroLife Palmistry</p>
        <h1 className="mt-3 text-3xl font-bold text-[#1A1A1A] md:text-5xl font-serif">Palm Report History</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6B635B]">
          View saved palm reports, fusion insights and future rescan comparisons.
        </p>
        <div className="mt-8">
          <PalmistryHistoryList />
        </div>
      </section>
    </main>
  );
}
