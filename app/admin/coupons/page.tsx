"use client"
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Scissors } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function AdminCoupons() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-on-surface">Coupons & Offers</h1>
          <p className="text-on-surface-variant">Manage promotional codes and discounts.</p>
        </div>
        <Button><Plus size={16} className="mr-2" /> Create Coupon</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Usage Limit</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-bold font-mono text-primary flex items-center gap-2">
                  <Scissors size={14} className="text-on-surface-variant"/> WELCOME10
                </TableCell>
                <TableCell>10% OFF</TableCell>
                <TableCell>145 / 500</TableCell>
                <TableCell>Dec 31, 2026</TableCell>
                <TableCell><Badge variant="success">Active</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-bold font-mono text-primary flex items-center gap-2">
                  <Scissors size={14} className="text-on-surface-variant"/> FREELATTE
                </TableCell>
                <TableCell>Free Item</TableCell>
                <TableCell>50 / 50</TableCell>
                <TableCell>Nov 15, 2026</TableCell>
                <TableCell><Badge variant="outline">Expired</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

