"use client"
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, MoreVertical, Edit, Trash } from 'lucide-react'
import { MOCK_MENU_ITEMS } from '@/lib/mockData'

export default function AdminMenu() {
  const [items, setItems] = useState(MOCK_MENU_ITEMS)
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-on-surface">Menu Management</h1>
          <p className="text-on-surface-variant">Add, edit, or remove products from your menu.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-3 text-on-surface-variant" />
            <Input placeholder="Search menu..." className="pl-9" />
          </div>
          <Button><Plus size={16} className="mr-2" /> Add Item</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.slice(0, 12).map((item) => (
          <Card key={item.id} className="overflow-hidden group flex flex-col">
            <div className="h-48 relative overflow-hidden bg-surface-container-high">
              <img 
                src={item.image_url || 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf'} 
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
                  <span className="bg-surface-container-highest px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                </div>
              )}
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-lg font-bold text-on-surface leading-tight">{item.name}</h3>
                <span className="font-bold text-primary whitespace-nowrap">₹{item.price}</span>
              </div>
              <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 flex-1">{item.description}</p>
              <div className="flex items-center gap-2 mt-auto">
                <Button variant="outline" size="sm" className="w-full"><Edit size={14} className="mr-2"/> Edit</Button>
                <Button variant="destructive" size="sm" className="w-full"><Trash size={14} className="mr-2"/> Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
