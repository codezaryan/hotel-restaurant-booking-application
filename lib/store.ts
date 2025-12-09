"use client"

import type { User, HotelBooking, RestaurantBooking, Review } from "./types"

interface AppStore {
  currentUser: User | null
  hotelBookings: HotelBooking[]
  restaurantBookings: RestaurantBooking[]
  reviews: Review[]
}

let store: AppStore = {
  currentUser: null,
  hotelBookings: [],
  restaurantBookings: [],
  reviews: [],
}

// Load from sessionStorage on init (for client-side persistence during session)
if (typeof window !== "undefined") {
  const saved = sessionStorage.getItem("app-store")
  if (saved) {
    store = JSON.parse(saved)
  }
}

export const getStore = () => store

export const updateStore = (updates: Partial<AppStore>) => {
  store = { ...store, ...updates }
  if (typeof window !== "undefined") {
    sessionStorage.setItem("app-store", JSON.stringify(store))
  }
}

export const setCurrentUser = (user: User | null) => {
  updateStore({ currentUser: user })
}

export const addHotelBooking = async (booking: HotelBooking) => {
  try {
    await fetch("/api/data/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "hotel", booking }),
    })
    updateStore({ hotelBookings: [...store.hotelBookings, booking] })
  } catch (error) {
    console.error("[v0] Error adding hotel booking:", error)
  }
}

export const addRestaurantBooking = async (booking: RestaurantBooking) => {
  try {
    await fetch("/api/data/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "restaurant", booking }),
    })
    updateStore({ restaurantBookings: [...store.restaurantBookings, booking] })
  } catch (error) {
    console.error("[v0] Error adding restaurant booking:", error)
  }
}

export const addReview = async (review: Review) => {
  try {
    await fetch("/api/data/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    })
    updateStore({ reviews: [...store.reviews, review] })
  } catch (error) {
    console.error("[v0] Error adding review:", error)
  }
}

export const cancelHotelBooking = async (bookingId: string) => {
  try {
    await fetch("/api/data/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "hotel", bookingId }),
    })
    updateStore({
      hotelBookings: store.hotelBookings.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" as const } : b)),
    })
  } catch (error) {
    console.error("[v0] Error cancelling hotel booking:", error)
  }
}

export const cancelRestaurantBooking = async (bookingId: string) => {
  try {
    await fetch("/api/data/bookings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "restaurant", bookingId }),
    })
    updateStore({
      restaurantBookings: store.restaurantBookings.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" as const } : b,
      ),
    })
  } catch (error) {
    console.error("[v0] Error cancelling restaurant booking:", error)
  }
}

export const getReviewsForHotel = (hotelId: string) => {
  return store.reviews.filter((r) => r.hotelId === hotelId)
}

export const getReviewsForRestaurant = (restaurantId: string) => {
  return store.reviews.filter((r) => r.restaurantId === restaurantId)
}

export const getAverageRating = (reviews: Review[]) => {
  if (reviews.length === 0) return 0
  return Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
}
