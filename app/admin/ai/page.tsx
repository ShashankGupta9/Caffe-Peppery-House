"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAIInsights } from '@/lib/admin/adminServices'
import { Bot, Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react'

export default function AdminAIAssistant() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getAIInsights()
      setInsights(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 flex items-center gap-3">
            <Bot className="text-blue-400" size={32} /> AI Inventory Assistant
          </h1>
          <p className="text-on-surface-variant mt-1">Powered by Gemini. Predictive analysis and smart recommendations.</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 border-none shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]">
          <Sparkles size={16} className="mr-2" /> Generate New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-surface-container border-blue-900/30 relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <TrendingUp size={18} /> Demand Forecasting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-on-surface-variant mb-4">Predicting ingredient needs for the upcoming weekend based on local weather and historical data.</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm border-b border-outline-variant/30 pb-2">
                <span>Milk (Full Cream)</span>
                <span className="font-bold text-on-surface">↑ 45L needed</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-outline-variant/30 pb-2">
                <span>Espresso Beans</span>
                <span className="font-bold text-on-surface">↑ 18kg needed</span>
              </div>
              <div className="flex justify-between items-center text-sm pb-2">
                <span>Matcha Powder</span>
                <span className="font-bold text-on-surface-variant">Stable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-surface-container border-purple-900/30 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Lightbulb size={18} /> Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-surface-container-high rounded-xl"></div>
                <div className="h-20 bg-surface-container-high rounded-xl"></div>
              </div>
            ) : (
              insights.map((insight, i) => (
                <div key={i} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex gap-4">
                  <div className="mt-1">
                    {insight.type === 'warning' && <AlertTriangle className="text-red-400" size={20} />}
                    {insight.type === 'suggestion' && <Lightbulb className="text-yellow-400" size={20} />}
                    {insight.type === 'trend' && <TrendingUp className="text-green-400" size={20} />}
                  </div>
                  <div>
                    <h4 className="font-medium text-on-surface mb-1">{insight.title}</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{insight.message}</p>
                    <div className="mt-3">
                      <Button variant="outline" size="sm" className="h-7 text-xs border-outline-variant hover:bg-surface-container-highest">Take Action</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
