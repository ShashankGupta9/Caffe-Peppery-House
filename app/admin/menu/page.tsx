"use client"
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, MoreVertical, Edit, Trash, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminMenu() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState<any>({ name: '', description: '', price: '', category: 'hot_coffee', image_url: '' })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadMenu() {
      const { data } = await supabase.from('menu_items').select('*').order('category');
      if (data) setItems(data);
      setLoading(false);
    }
    loadMenu();
  }, [])

  const openAddModal = () => {
    setFormData({ name: '', description: '', price: '', category: 'hot_coffee', image_url: '' })
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setFormData({ 
      name: item.name, 
      description: item.description, 
      price: item.price, 
      category: item.category, 
      image_url: item.image_url 
    })
    setEditingId(item.id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (error) {
      alert("Error deleting item: " + error.message)
      return
    }
    setItems(items.filter(item => item.id !== id))
  }

  const handleSave = async () => {
    if (editingId) {
      const { data, error } = await supabase.from('menu_items').update(formData).eq('id', editingId).select()
      if (error) {
        alert("Error updating item: " + error.message)
        return
      }
      if (data && data.length > 0) {
        setItems(items.map(item => item.id === editingId ? data[0] : item))
      }
    } else {
      const { data, error } = await supabase.from('menu_items').insert([formData]).select()
      if (error) {
        alert("Error adding item: " + error.message)
        return
      }
      if (data && data.length > 0) {
        setItems([...items, data[0]])
      }
    }
    setIsModalOpen(false)
  }

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-on-surface">Menu Management</h1>
          <p className="text-on-surface-variant">Add, edit, or remove products from your menu.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-3 text-on-surface-variant" />
            <Input 
              placeholder="Search menu..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={openAddModal}><Plus size={16} className="mr-2" /> Add Item</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-on-surface-variant animate-pulse">Loading menu items...</div>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group flex flex-col">
              <div className="h-48 relative overflow-hidden bg-surface-container-high">
                <img 
                  src={item.image_url || 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800'} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
                />
                <div className="absolute top-2 right-2">
                  <Button variant="secondary" size="icon" className="h-8 w-8 bg-surface/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical size={16} />
                  </Button>
                </div>
                {!item.is_available && (
                  <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-red-500">Out of Stock</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-lg font-bold text-on-surface leading-tight">{item.name}</h3>
                  <span className="font-bold text-primary whitespace-nowrap">₹{item.price}</span>
                </div>
                <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 flex-1">{item.description}</p>
                <div className="flex items-center gap-2 mt-auto">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => openEditModal(item)}>
                    <Edit size={14} className="mr-2"/> Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete(item.id)}>
                    <Trash size={14} className="mr-2"/> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-6 rounded-xl w-full max-w-md border border-outline-variant/30 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-display text-on-surface">{editingId ? 'Edit Item' : 'Add Item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Category (slug)</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="hot_coffee">Hot Coffee</option>
                  <option value="cold_coffee">Cold Coffee</option>
                  <option value="snacks">Snacks</option>
                  <option value="desserts">Desserts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Price (₹)</label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Description</label>
                <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Image URL</label>
                <Input value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSave}>{editingId ? 'Save Changes' : 'Add Item'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

