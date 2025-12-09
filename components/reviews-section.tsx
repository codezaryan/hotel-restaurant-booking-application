"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import type { Review } from "@/lib/types"
import { getStore, addReview } from "@/lib/store"

interface ReviewsSectionProps {
  hotelId?: string
  restaurantId?: string
  reviews: Review[]
}

export function ReviewsSection({ hotelId, restaurantId, reviews }: ReviewsSectionProps) {
  const store = getStore()
  const [isAddingReview, setIsAddingReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")

  const handleAddReview = async () => {
    if (!store.currentUser) {
      alert("Please login to add a review")
      return
    }

    if (!comment.trim()) {
      alert("Please enter a comment")
      return
    }

    const review: Review = {
      id: `review-${Date.now()}`,
      userId: store.currentUser.id,
      userName: store.currentUser.name,
      hotelId,
      restaurantId,
      rating,
      comment,
      createdAt: new Date(),
    }

    await addReview(review)
    setComment("")
    setRating(5)
    setIsAddingReview(false)
  }

  const averageRating =
    reviews.length > 0 ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 : 0

  return (
    <div className="space-y-6">
      {/* Average Rating */}
      {reviews.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold">{averageRating}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(averageRating)
                            ? "fill-primary text-primary"
                            : i < averageRating
                              ? "fill-primary/50 text-primary"
                              : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Based on {reviews.length} reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Review Form */}
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent>
          {!isAddingReview ? (
            <Button onClick={() => setIsAddingReview(true)} className="w-full">
              Add Your Review
            </Button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 cursor-pointer ${
                          star <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Review</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md bg-background text-foreground text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddReview} className="flex-1">
                  Post Review
                </Button>
                <Button onClick={() => setIsAddingReview(false)} variant="outline" className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Guest Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">{review.userName}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-primary text-primary" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {reviews.length === 0 && !isAddingReview && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
