"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Clock } from 'lucide-react'

export default function AdminNotifications() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-serif text-on-surface">Notifications</h1>
        <p className="text-on-surface-variant">Send announcements and push notifications to customers.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Announcement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Title</label>
            <Input placeholder="e.g., Weekend Special: 20% off all cold brews!" />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Message</label>
            <textarea 
              className="flex w-full rounded-md border border-outline bg-surface px-3 py-2 text-sm placeholder:text-on-surface-variant/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[120px]" 
              placeholder="Write your message here..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline"><Clock size={16} className="mr-2"/> Schedule</Button>
            <Button><Send size={16} className="mr-2"/> Send Now</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
