"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { getCustomers } from '@/lib/admin/adminServices'
import { Search, Mail, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getCustomers()
      setCustomers(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-on-surface">Customers</h1>
          <p className="text-on-surface-variant">View customer profiles and order history.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-3 text-on-surface-variant" />
          <Input placeholder="Search customers..." className="pl-9" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant animate-pulse">Loading customers...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Total Orders</TableHead>
                  <TableHead>Lifetime Value</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-on-surface-variant">{c.id}</TableCell>
                    <TableCell>
                      <div className="font-medium text-on-surface">{c.name}</div>
                      <div className="text-xs text-on-surface-variant">{c.email}</div>
                    </TableCell>
                    <TableCell>{c.totalOrders}</TableCell>
                    <TableCell className="text-primary font-bold">₹{c.lifetimeValue}</TableCell>
                    <TableCell>{c.lastVisit}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-on-surface"><Mail size={16} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-on-surface"><ExternalLink size={16} /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

