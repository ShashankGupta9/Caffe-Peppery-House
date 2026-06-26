import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .update(body)
    .eq('id', params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
