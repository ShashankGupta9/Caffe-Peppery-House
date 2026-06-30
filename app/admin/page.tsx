"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats, getSalesData, getAIInsights } from '@/lib/admin/adminServices'
import { IndianRupee, ShoppingBag, Users, TrendingUp, Sparkles } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [sales, setSales] = useState<any>(null)
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [s, sd, i] = await Promise.all([
        getDashboardStats(),
        getSalesData(),
        getAIInsights()
      ])
      setStats(s)
      setSales(sd)
      setInsights(i)
      setLoading(false)
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-surface-container-high rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-surface-container-low rounded-xl border border-outline-variant/30"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 lg:col-span-2 bg-surface-container-low rounded-xl border border-outline-variant/30"></div>
          <div className="h-96 bg-surface-container-low rounded-xl border border-outline-variant/30"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-on-surface">Overview</h1>
        <p className="text-on-surface-variant">Here's what's happening at Peppery House today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Today's Revenue</CardTitle>
            <IndianRupee size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">₹{stats.todayRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-400 mt-1 flex items-center">
              <TrendingUp size={12} className="mr-1" /> +{stats.revenueGrowth}% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Total Orders</CardTitle>
            <ShoppingBag size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">{stats.totalOrders}</div>
            <p className="text-xs text-green-400 mt-1 flex items-center">
              <TrendingUp size={12} className="mr-1" /> +{stats.ordersGrowth}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Customers</CardTitle>
            <Users size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">{stats.totalCustomers}</div>
            <p className="text-xs text-green-400 mt-1 flex items-center">
              <TrendingUp size={12} className="mr-1" /> +{stats.customersGrowth}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-on-surface-variant">Avg Order Value</CardTitle>
            <TrendingUp size={16} className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-on-surface">₹{stats.averageOrderValue}</div>
            <p className="text-xs text-red-400 mt-1 flex items-center">
               {stats.aovGrowth}% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sales} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#51453e" vertical={false} />
                  <XAxis dataKey="time" stroke="#9e8d83" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9e8d83" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#2B1D16', borderColor: '#51453e', color: '#F7F3EE' }}
                    itemStyle={{ color: '#c87740' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#c87740" strokeWidth={3} dot={{ r: 4, fill: '#c87740' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={120} />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-caramel">
              <Sparkles size={18} /> AI Assistant Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight: any, i: number) => (
              <div key={i} className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-on-surface">{insight.title}</h4>
                  <Badge variant={insight.type === 'warning' ? 'destructive' : insight.type === 'suggestion' ? 'secondary' : 'default'}>
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{insight.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
