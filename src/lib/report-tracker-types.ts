export interface ReportAuditRecord {
  id?: string;
  reportCode: string;
  reportType: string;
  reportTitle: string;
  pageCount?: string;

  // Account details
  userId?: string | null;
  userEmail: string;
  isAdminGenerated: boolean;
  isSample: boolean;

  // Native details (subject of the chart)
  nativeName: string;
  nativeDob: string;
  nativeTob: string;
  nativeCity: string;
  nativeLat?: number | null;
  nativeLon?: number | null;
  nativeTz?: number | null;

  // Astrological Snapshot
  lagnaRashi?: string | null;
  moonSign?: string | null;
  nakshatra?: string | null;

  // Execution & Audit details
  generatedAt: string;
  generationDurationMs?: number;
  pdfEngine?: string;
  status: "success" | "failed";
  errorMessage?: string;
}
