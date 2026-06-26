import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*, menu_categories(id, name)")
    .order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}
