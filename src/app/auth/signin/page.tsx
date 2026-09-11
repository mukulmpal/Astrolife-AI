import { redirect } from "next/navigation";

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string | string[] } | undefined>;
}) {
  const params = (await searchParams) ?? {};
  const nextParam = params.next;
  const next = Array.isArray(nextParam) ? nextParam[0] : nextParam;
  const safeNext = typeof next === "string" && next.startsWith("/") ? next : undefined;

  redirect(safeNext ? `/login?next=${encodeURIComponent(safeNext)}` : "/login");
}
