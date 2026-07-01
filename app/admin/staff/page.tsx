"use client"
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'

export default function AdminStaff() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-on-surface">Staff Management</h1>
          <p className="text-on-surface-variant">Manage team members and roles.</p>
        </div>
        <Button><Plus size={16} className="mr-2" /> Add Staff</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Admin User</TableCell>
                <TableCell><Badge>Owner</Badge></TableCell>
                <TableCell><Badge variant="success">Active</Badge></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="sm">Edit</Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Ravi Kumar</TableCell>
                <TableCell><Badge variant="outline">Manager</Badge></TableCell>
                <TableCell><Badge variant="success">Active</Badge></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="sm">Edit</Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Sonia Singh</TableCell>
                <TableCell><Badge variant="secondary">Barista</Badge></TableCell>
                <TableCell><Badge variant="success">Active</Badge></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="sm">Edit</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

