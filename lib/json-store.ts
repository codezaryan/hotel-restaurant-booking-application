// JSON-based data storage system with file operations
import type { Hotel, Restaurant, User, HotelBooking, RestaurantBooking, Review } from "./types"

interface DataStore {
  hotels: Hotel[]
  restaurants: Restaurant[]
  users: User[]
  hotelBookings: HotelBooking[]
  restaurantBookings: RestaurantBooking[]
  reviews: Review[]
}

// In-memory cache of JSON data (persists during session)
let dataCache: DataStore | null = null

async function loadJsonData(): Promise<DataStore> {
  if (dataCache) {
    return dataCache
  }

  try {
    const [hotelsRes, restaurantsRes, usersRes, bookingsRes, reviewsRes] = await Promise.all([
      fetch("/api/data/hotels"),
      fetch("/api/data/restaurants"),
      fetch("/api/data/users"),
      fetch("/api/data/bookings"),
      fetch("/api/data/reviews"),
    ])

    const hotels = await hotelsRes.json()
    const restaurants = await restaurantsRes.json()
    const users = await usersRes.json()
    const bookings = await bookingsRes.json()
    const reviews = await reviewsRes.json()

    dataCache = {
      hotels,
      restaurants,
      users,
      hotelBookings: bookings.hotelBookings,
      restaurantBookings: bookings.restaurantBookings,
      reviews,
    }

    return dataCache
  } catch (error) {
    console.error("[v0] Error loading JSON data:", error)
    return {
      hotels: [],
      restaurants: [],
      users: [],
      hotelBookings: [],
      restaurantBookings: [],
      reviews: [],
    }
  }
}

function invalidateCache() {
  dataCache = null
}

export async function getHotels(): Promise<Hotel[]> {
  const data = await loadJsonData()
  return data.hotels
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const data = await loadJsonData()
  return data.restaurants
}

export async function getHotel(id: string): Promise<Hotel | undefined> {
  const data = await loadJsonData()
  return data.hotels.find((h) => h.id === id)
}

export async function getRestaurant(id: string): Promise<Restaurant | undefined> {
  const data = await loadJsonData()
  return data.restaurants.find((r) => r.id === id)
}

export async function getUsers(): Promise<User[]> {
  const data = await loadJsonData()
  return data.users
}

export async function getUser(email: string): Promise<User | undefined> {
  const data = await loadJsonData()
  return data.users.find((u) => u.email === email)
}

export async function getUserById(id: string): Promise<User | undefined> {
  const data = await loadJsonData()
  return data.users.find((u) => u.id === id)
}

export async function addUser(user: User): Promise<void> {
  try {
    await fetch("/api/data/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
    invalidateCache()
  } catch (error) {
    console.error("[v0] Error adding user:", error)
  }
}

export async function getHotelBookings(userId: string): Promise<HotelBooking[]> {
  const data = await loadJsonData()
  return data.hotelBookings.filter((b) => b.userId === userId)
}

export async function getRestaurantBookings(userId: string): Promise<RestaurantBooking[]> {
  const data = await loadJsonData()
  return data.restaurantBookings.filter((b) => b.userId === userId)
}

export async function addHotelBooking(booking: HotelBooking): Promise<void> {
  try {
    await fetch("/api/data/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "hotel", booking }),
    })
    invalidateCache()
  } catch (error) {
    console.error("[v0] Error adding hotel booking:", error)
  }
}

export async function addRestaurantBooking(booking: RestaurantBooking): Promise<void> {
  try {
    await fetch("/api/data/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "restaurant", booking }),
    })
    invalidateCache()
  } catch (error) {
    console.error("[v0] Error adding restaurant booking:", error)
  }
}

export async function cancelHotelBooking(bookingId: string): Promise<void> {
  try {
    await fetch("/api/data/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "hotel", bookingId }),
    })
    invalidateCache()
  } catch (error) {
    console.error("[v0] Error cancelling hotel booking:", error)
  }
}

export async function cancelRestaurantBooking(bookingId: string): Promise<void> {
  try {
    await fetch("/api/data/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "restaurant", bookingId }),
    })
    invalidateCache()
  } catch (error) {
    console.error("[v0] Error cancelling restaurant booking:", error)
  }
}

export async function getReviews(type: "hotel" | "restaurant", id: string): Promise<Review[]> {
  const data = await loadJsonData()
  if (type === "hotel") {
    return data.reviews.filter((r) => r.hotelId === id)
  }
  return data.reviews.filter((r) => r.restaurantId === id)
}

export async function addReview(review: Review): Promise<void> {
  try {
    await fetch("/api/data/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    })
    invalidateCache()
  } catch (error) {
    console.error("[v0] Error adding review:", error)
  }
}

export async function getAllBookings() {
  const data = await loadJsonData()
  return {
    hotels: data.hotelBookings,
    restaurants: data.restaurantBookings,
  }
}

export async function getAllReviews(): Promise<Review[]> {
  const data = await loadJsonData()
  return data.reviews
}
