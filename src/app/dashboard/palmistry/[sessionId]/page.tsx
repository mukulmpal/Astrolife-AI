import { PalmistrySessionDetail } from "@/components/palmistry/palmistry-session-detail";

export default async function PalmistrySessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <PalmistrySessionDetail sessionId={sessionId} />
    </main>
  );
}
