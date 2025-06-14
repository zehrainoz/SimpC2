import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // This is a placeholder for your Go backend API call
    // In a real application, you would make a fetch request to your Go backend

    // Simulate a successful login for demonstration
    if (username && password) {
      // Mock successful response
      return NextResponse.json({
        success: true,
        token: "mock-jwt-token",
        user: {
          id: "1",
          username,
        },
      })
    } else {
      // Mock failed login
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
