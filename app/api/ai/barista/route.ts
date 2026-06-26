import { NextRequest, NextResponse } from "next/server";
import { getAIBaristaRecommendation } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { context } = await req.json();
    if (!context) return NextResponse.json({ error: "Missing context" }, { status: 400 });
    const recommendation = await getAIBaristaRecommendation(context);
    return NextResponse.json({ recommendation });
  } catch {
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
