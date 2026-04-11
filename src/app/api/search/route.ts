import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { executeSearch } from "@/lib/services/search";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { query, type = "name" } = body;

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Search query is required (min 2 chars)" }, { status: 400 });
    }

    const validTypes = ["name", "email", "phone", "username", "domain", "company"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: `Invalid type. Must be one of: ${validTypes.join(", ")}` }, { status: 400 });
    }

    const result = await executeSearch({
      query: query.trim(),
      type,
      userId: session.user.id,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 });
  }
}
