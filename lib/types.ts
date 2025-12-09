// Shared types for the entire application

export type User = {
  id: string
  email: string
  password: string
  name: string
  phone: string
  createdAt: Date
  isAdmin: boolean
}

export type Hotel = {
  id: string
  name: string
  location: string
  rating: number
  reviews: number
  image: string
  description: string
  amenities: string[]
  pricePerNight: number
}

export type HotelRoom = {
  id: string
  hotelId: string
  type: string // Single, Double, Suite, etc.
  capacity: number
  price: number
  availableRooms: number
}

export type Restaurant = {
  id: string
  name: string
  location: string
  rating: number
  reviews: number
  image: string
  cuisine: string
  priceRange: string
  description: string
  workingHours: string
}

export type HotelBooking = {
  id: string
  userId: string
  hotelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  numberOfRooms: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
  createdAt: Date
}

export type RestaurantBooking = {
  id: string
  userId: string
  restaurantId: string
  date: string
  time: string
  numberOfPeople: number
  specialRequests: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: Date
}

export type Review = {
  id: string
  userId: string
  userName: string
  hotelId?: string
  restaurantId?: string
  rating: number
  comment: string
  createdAt: Date
}
