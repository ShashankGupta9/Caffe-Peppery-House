"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getReviews } from '@/lib/admin/adminServices'
import { Star, CheckCircle, XCircle, Reply } from 'lucide-react'

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getReviews()
      setReviews(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-serif text-on-surface">Reviews</h1>
        <p className="text-on-surface-variant">Manage customer feedback and ratings.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-surface-container-low rounded-xl"></div>
            <div className="h-32 bg-surface-container-low rounded-xl"></div>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className={review.status === 'pending' ? 'border-primary/50' : ''}>
              <CardContent className="p-6 flex flex-col sm:flex-row gap-6 justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-on-surface">{review.customer}</h3>
                    <span className="text-xs text-on-surface-variant">{review.date}</span>
                    {review.status === 'pending' && <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full font-medium">Needs Review</span>}
                  </div>
                  <div className="flex text-yellow-500 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} strokeWidth={i < review.rating ? 0 : 1} className={i >= review.rating ? "text-outline" : ""} />
                    ))}
                  </div>
                  <p className="text-on-surface-variant text-sm">{review.comment}</p>
                </div>
                
                <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                  {review.status === 'pending' ? (
                    <>
                      <Button size="sm" variant="outline" className="w-full sm:w-auto text-green-400 hover:text-green-300 hover:bg-green-900/20 border-green-900/50"><CheckCircle size={14} className="mr-2"/> Approve</Button>
                      <Button size="sm" variant="outline" className="w-full sm:w-auto text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-900/50"><XCircle size={14} className="mr-2"/> Reject</Button>
                    </>
                  ) : (
                    <Button size="sm" variant="secondary" className="w-full sm:w-auto"><Reply size={14} className="mr-2"/> Reply</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
