import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  // Clear cookies or any stored authentication data
  cookies().delete("token")

  // Redirect to login page
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"))
}
