import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json();
    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", params.id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ order: data });
  } catch {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
