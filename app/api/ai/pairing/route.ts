import { NextRequest, NextResponse } from "next/server";
import { getCoffeePairing } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { drink } = await req.json();
    if (!drink) return NextResponse.json({ error: "Missing drink" }, { status: 400 });
    const recommendation = await getCoffeePairing(drink);
    return NextResponse.json({ recommendation });
  } catch {
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }
}
