import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const start = Date.now();
  let dbStatus: "ok" | "error" = "ok";
  let dbLatency = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - dbStart;
  } catch {
    dbStatus = "error";
  }

  const overall = dbStatus === "ok" ? "healthy" : "degraded";

  return NextResponse.json(
    {
      status: overall,
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? Math.round(process.uptime()) : null,
      checks: {
        database: { status: dbStatus, latencyMs: dbLatency },
      },
      responseTimeMs: Date.now() - start,
    },
    { status: dbStatus === "ok" ? 200 : 503 }
  );
}
