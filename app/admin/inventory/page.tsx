"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getInventory } from '@/lib/admin/adminServices'
import { PackagePlus, Search, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function AdminInventory() {
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getInventory()
      setInventory(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-on-surface">Inventory Management</h1>
          <p className="text-on-surface-variant">Track ingredients and raw materials.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-3 text-on-surface-variant" />
            <Input placeholder="Search inventory..." className="pl-9" />
          </div>
          <Button><PackagePlus size={16} className="mr-2" /> Add Stock</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant animate-pulse">Loading inventory...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Min. Threshold</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <span className={item.stock <= item.minStock ? "text-red-400 font-bold" : "text-on-surface"}>
                        {item.stock} {item.unit}
                      </span>
                    </TableCell>
                    <TableCell>{item.minStock} {item.unit}</TableCell>
                    <TableCell className="text-on-surface-variant">{item.supplier}</TableCell>
                    <TableCell>
                      {item.status === 'out_of_stock' && <Badge variant="destructive">Out of Stock</Badge>}
                      {item.status === 'low_stock' && <Badge variant="warning">Low Stock</Badge>}
                      {item.status === 'in_stock' && <Badge variant="success">In Stock</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-8">Restock</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {inventory.some(i => i.status !== 'in_stock') && (
        <div className="bg-red-900/20 border border-red-900/50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-red-400 font-medium">Attention Required</h4>
            <p className="text-sm text-red-400/80 mt-1">You have items that are low or out of stock. Please reorder from suppliers soon to avoid menu disruptions.</p>
          </div>
        </div>
      )}
    </div>
  )
}
