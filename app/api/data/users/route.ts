import { NextResponse } from "next/server"

// In-memory user storage (in production, this would be persistent)
const usersStore = [
  {
    id: "user-1",
    email: "john@example.com",
    password: "hashedpassword123",
    name: "John Doe",
    phone: "+1-555-1234",
    createdAt: "2024-01-15T10:30:00Z",
    isAdmin: false,
  },
  {
    id: "admin-1",
    email: "admin@example.com",
    password: "hashedpassword123",
    name: "Admin User",
    phone: "+1-555-9999",
    createdAt: "2024-01-01T08:00:00Z",
    isAdmin: true,
  },
]

export async function GET() {
  return NextResponse.json(usersStore)
}

export async function POST(request: Request) {
  try {
    const user = await request.json()
    usersStore.push(user)
    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add user" }, { status: 400 })
  }
}
