"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-serif text-on-surface">Settings</h1>
        <p className="text-on-surface-variant">Manage your café's general information and configurations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Café Name</label>
              <Input defaultValue="Peppery House" />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Contact Phone</label>
              <Input defaultValue="+91-XXXXXXXXXX" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface-variant mb-1">Address</label>
            <Input defaultValue="Peppery House, Bhopal, India" />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button><Save size={16} className="mr-2"/> Save Changes</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-container-high rounded-xl border border-outline-variant/30">
            <div>
              <h4 className="font-medium text-on-surface">Accepting Online Orders</h4>
              <p className="text-sm text-on-surface-variant">Toggle whether customers can place new orders through the website.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
