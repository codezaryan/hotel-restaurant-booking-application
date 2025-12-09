import { NextResponse } from "next/server"

// In-memory reviews storage (in production, this would be persistent)
const reviewsStore = [
  {
    id: "review-1",
    userId: "user-1",
    userName: "John Doe",
    hotelId: "hotel-1",
    rating: 5,
    comment: "Exceptional service and luxurious rooms. Highly recommend!",
    createdAt: "2024-02-10T14:30:00Z",
  },
  {
    id: "review-2",
    userId: "user-1",
    userName: "John Doe",
    restaurantId: "rest-1",
    rating: 5,
    comment: "Best Italian food I've ever had. The pasta was divine!",
    createdAt: "2024-02-09T19:45:00Z",
  },
  {
    id: "review-3",
    userId: "user-2",
    userName: "Sarah Smith",
    hotelId: "hotel-2",
    rating: 4,
    comment: "Great location and friendly staff. Rooms could be larger.",
    createdAt: "2024-02-08T11:20:00Z",
  },
  {
    id: "review-4",
    userId: "user-3",
    userName: "Michael Johnson",
    restaurantId: "rest-3",
    rating: 5,
    comment: "Prime steaks and excellent wine selection. Perfect for special occasions.",
    createdAt: "2024-02-07T21:00:00Z",
  },
  {
    id: "review-5",
    userId: "user-4",
    userName: "Emma Wilson",
    hotelId: "hotel-4",
    rating: 5,
    comment: "Breathtaking mountain views. Best resort experience!",
    createdAt: "2024-02-06T16:30:00Z",
  },
]

export async function GET() {
  return NextResponse.json(reviewsStore)
}

export async function POST(request: Request) {
  try {
    const review = await request.json()
    reviewsStore.push(review)
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add review" }, { status: 400 })
  }
}
