"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ArrowUpRight } from 'lucide-react'

const hourlyData = [
  { name: '8 AM', orders: 12 },
  { name: '10 AM', orders: 35 },
  { name: '12 PM', orders: 68 },
  { name: '2 PM', orders: 42 },
  { name: '4 PM', orders: 28 },
  { name: '6 PM', orders: 55 },
  { name: '8 PM', orders: 40 },
]

const categoryData = [
  { name: 'Hot Coffee', value: 45 },
  { name: 'Cold Coffee', value: 25 },
  { name: 'Snacks', value: 20 },
  { name: 'Desserts', value: 10 },
]

const COLORS = ['#c87740', '#8B5A3A', '#4A3040', '#9e8d83']

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-on-surface">Analytics</h1>
        <p className="text-on-surface-variant">Deep dive into your café's performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours (Orders)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#51453e" vertical={false} />
                  <XAxis dataKey="name" stroke="#9e8d83" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9e8d83" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{fill: '#2B1D16'}}
                    contentStyle={{ backgroundColor: '#2B1D16', borderColor: '#51453e', color: '#F7F3EE' }}
                    itemStyle={{ color: '#c87740' }}
                  />
                  <Bar dataKey="orders" fill="#c87740" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="h-[300px] w-full max-w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#2B1D16', borderColor: '#51453e', color: '#F7F3EE' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                  <span className="text-on-surface">{cat.name}</span>
                  <span className="font-bold text-on-surface-variant ml-auto">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Customer Retention', value: '42%', trend: '+5%' },
          { title: 'Cart Abandonment', value: '18%', trend: '-2%' },
          { title: 'Avg Preparation Time', value: '6m 20s', trend: '-30s' },
        ].map((metric, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-on-surface-variant mb-2">{metric.title}</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-on-surface">{metric.value}</span>
                <span className="text-sm text-green-400 flex items-center bg-green-400/10 px-2 py-0.5 rounded-full">
                  <ArrowUpRight size={14} className="mr-1"/> {metric.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
