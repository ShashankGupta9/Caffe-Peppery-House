import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { user_id, menu_item_id, rating, comment } = await req.json();
  const { data, error } = await supabase
    .from('reviews')
    .insert({ user_id, menu_item_id, rating, comment })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ review: data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const menuItemId = searchParams.get('menu_item_id');
  let query = supabase.from('reviews').select('*, user:users(name)').order('created_at', { ascending: false });
  if (menuItemId) query = query.eq('menu_item_id', menuItemId);
  const { data } = await query;
  return NextResponse.json(data || []);
}
