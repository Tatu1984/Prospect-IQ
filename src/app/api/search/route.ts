import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { executeSearch } from "@/lib/services/search";
import { searchSchema, formatZodError } from "@/lib/validations";
import { searchRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/db";

const SEARCH_COST = 2;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit per user
  const limit = searchRateLimit(session.user.id);
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many searches. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
    );
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Validate with Zod
    const parsed = searchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
    }

    const { query, type } = parsed.data;

    // Atomic credit check + deduct (prevents race condition)
    const updatedUser = await prisma.user.updateMany({
      where: {
        id: session.user.id,
        creditsBalance: { gte: SEARCH_COST },
      },
      data: { creditsBalance: { decrement: SEARCH_COST } },
    });

    if (updatedUser.count === 0) {
      return NextResponse.json(
        { error: "Insufficient credits. Please top up your balance." },
        { status: 402 }
      );
    }

    try {
      const result = await executeSearch({
        query,
        type: type === "natural_language" ? "name" : type,
        userId: session.user.id,
      });
      return NextResponse.json(result);
    } catch (searchError) {
      // Refund credits on search failure
      await prisma.user.update({
        where: { id: session.user.id },
        data: { creditsBalance: { increment: SEARCH_COST } },
      });
      throw searchError;
    }
  } catch (error) {
    const errObj = error as Error;
    console.error("[search] error:", errObj?.message, errObj?.stack);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
