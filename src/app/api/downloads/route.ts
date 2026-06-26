import { db } from "@/db";
import { downloads } from "@/db/schema";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(downloads);
    return Response.json({ ok: true, count: result[0]?.count ?? 0 });
  } catch {
    return Response.json({ ok: true, count: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const ua = request.headers.get("user-agent") || "unknown";

    // Simple hash of IP (we don't store actual IPs)
    const forwarded = request.headers.get("x-forwarded-for") || "unknown";
    const ipHash = Buffer.from(forwarded).toString("base64").slice(0, 64);

    await db.insert(downloads).values({
      ipHash,
      userAgent: ua,
    });

    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(downloads);

    return Response.json({ ok: true, count: result[0]?.count ?? 0 });
  } catch {
    return Response.json({ ok: true, count: 0 });
  }
}
