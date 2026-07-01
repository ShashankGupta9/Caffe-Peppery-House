"use client"
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from 'lucide-react'

export default function AdminSecurity() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-on-surface">Security & Logs</h1>
        <p className="text-on-surface-variant">Monitor system activity and logins.</p>
      </div>

      <div className="bg-surface-container border border-primary/20 rounded-xl p-6 flex items-start gap-4">
        <ShieldCheck className="text-primary shrink-0" size={32} />
        <div>
          <h3 className="text-lg font-bold text-primary">System is Secure</h3>
          <p className="text-sm text-on-surface-variant mt-1">No suspicious activity detected in the last 30 days. Two-factor authentication is recommended for all admin accounts.</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Successful Login</TableCell>
                <TableCell>admin@pepperyhouse.com</TableCell>
                <TableCell className="text-on-surface-variant font-mono text-xs">192.168.1.1</TableCell>
                <TableCell>Oct 25, 2023 - 10:45 AM</TableCell>
                <TableCell><Badge variant="success">Success</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Password Changed</TableCell>
                <TableCell>admin@pepperyhouse.com</TableCell>
                <TableCell className="text-on-surface-variant font-mono text-xs">192.168.1.1</TableCell>
                <TableCell>Oct 20, 2023 - 02:15 PM</TableCell>
                <TableCell><Badge variant="success">Success</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Failed Login Attempt</TableCell>
                <TableCell>unknown</TableCell>
                <TableCell className="text-on-surface-variant font-mono text-xs text-red-400">45.22.11.9</TableCell>
                <TableCell>Oct 18, 2023 - 11:30 PM</TableCell>
                <TableCell><Badge variant="destructive">Blocked</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

