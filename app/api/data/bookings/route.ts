import { NextResponse } from "next/server"

// In-memory booking storage (in production, this would be persistent)
const bookingsStore = {
  hotelBookings: [],
  restaurantBookings: [],
}

export async function GET() {
  return NextResponse.json(bookingsStore)
}

export async function POST(request: Request) {
  try {
    const { type, booking } = await request.json()
    if (type === "hotel") {
      bookingsStore.hotelBookings.push(booking)
    } else {
      bookingsStore.restaurantBookings.push(booking)
    }
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add booking" }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { type, bookingId } = await request.json()
    if (type === "hotel") {
      bookingsStore.hotelBookings = bookingsStore.hotelBookings.map((b: any) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b,
      )
    } else {
      bookingsStore.restaurantBookings = bookingsStore.restaurantBookings.map((b: any) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b,
      )
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 400 })
  }
}
