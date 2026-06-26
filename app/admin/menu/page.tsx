'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MenuItem, MenuCategory } from '@/types';
import { Plus, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null);

  useEffect(() => {
    async function fetch() {
      const { data: cats } = await supabase.from('menu_categories').select('*').order('sort_order');
      const { data: menuItems } = await supabase.from('menu_items').select('*, category:menu_categories(*)').order('created_at');
      setCategories(cats || []);
      setItems(menuItems || []);
      setLoading(false);
    }
    fetch();
  }, []);

  async function toggleAvailability(item: MenuItem) {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id);
    if (!error) {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_available: !i.is_available } : i));
      toast.success(`${item.name} ${item.is_available ? 'hidden' : 'shown'}`);
    }
  }

  async function saveItem(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    if (editing.id) {
      await supabase.from('menu_items').update(editing).eq('id', editing.id);
      setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...editing } as MenuItem : i));
    } else {
      const { data } = await supabase.from('menu_items').insert({ ...editing, is_available: true }).select().single();
      if (data) setItems(prev => [...prev, data]);
    }
    toast.success('Menu item saved');
    setEditing(null);
  }

  return (
    <div className="min-h-screen bg-[#F5ECD8]">
      <nav className="bg-[#2E1F26] px-6 py-4 flex items-center justify-between">
        <span className="text-[#C87740] font-serif text-xl font-bold">Menu Management</span>
        <a href="/admin" className="text-[#F5ECD8]/60 text-sm hover:text-[#C87740]">← Dashboard</a>
      </nav>

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#2E1F26] font-serif">Menu Items</h1>
          <button
            onClick={() => setEditing({ name: '', description: '', price: 0, category_id: categories[0]?.id })}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="font-serif text-xl font-bold text-[#2E1F26] mb-4">
                {editing.id ? 'Edit Item' : 'New Item'}
              </h2>
              <form onSubmit={saveItem} className="space-y-4">
                <input
                  required
                  placeholder="Item name"
                  value={editing.name || ''}
                  onChange={e => setEditing(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-[#C87740]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C87740]"
                />
                <textarea
                  placeholder="Description"
                  value={editing.description || ''}
                  onChange={e => setEditing(p => ({ ...p, description: e.target.value }))}
                  className="w-full border border-[#C87740]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C87740] h-24 resize-none"
                />
                <div className="flex gap-3">
                  <input
                    type="number"
                    required
                    placeholder="Price (₹)"
                    value={editing.price || ''}
                    onChange={e => setEditing(p => ({ ...p, price: Number(e.target.value) }))}
                    className="flex-1 border border-[#C87740]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C87740]"
                  />
                  <select
                    value={editing.category_id || ''}
                    onChange={e => setEditing(p => ({ ...p, category_id: e.target.value }))}
                    className="flex-1 border border-[#C87740]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C87740]"
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={editing.image_url || ''}
                  onChange={e => setEditing(p => ({ ...p, image_url: e.target.value }))}
                  className="w-full border border-[#C87740]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C87740]"
                />
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 btn-primary">Save</button>
                  <button type="button" onClick={() => setEditing(null)} className="flex-1 btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3">
          {categories.map(cat => (
            <div key={cat.id}>
              <h2 className="font-serif font-semibold text-[#8B5A3A] mb-2 text-sm uppercase tracking-wider">{cat.name}</h2>
              {items.filter(i => i.category_id === cat.id).map(item => (
                <div key={item.id} className="bg-white rounded-xl px-5 py-4 border border-[#C87740]/10 flex items-center gap-4 mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-[#2E1F26]">{item.name}</p>
                    <p className="text-sm text-[#8B5A3A] line-clamp-1">{item.description}</p>
                  </div>
                  <span className="text-[#C87740] font-bold">₹{item.price}</span>
                  <button onClick={() => toggleAvailability(item)} className="text-[#C87740]">
                    {item.is_available ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="opacity-40" />}
                  </button>
                  <button onClick={() => setEditing(item)} className="text-[#8B5A3A] hover:text-[#C87740]">
                    <Edit2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
