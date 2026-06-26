import { NextRequest, NextResponse } from "next/server";
import { getMoodRecommendation } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { energy, taste, temp } = await req.json();
    if (!energy || !taste || !temp) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const recommendation = await getMoodRecommendation(energy, taste, temp);
    return NextResponse.json({ recommendation });
  } catch {
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
