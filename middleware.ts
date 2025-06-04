import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === "/auth/signin" || path === "/auth/register" || path === "/";
  
  // Get the token to check if the user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect logic
  if (isPublicPath && token) {
    // If user is on a public path but is already logged in, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicPath && !token) {
    // If user is trying to access a protected path but is not logged in, redirect to login
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

// Configure paths that should be checked by this middleware
export const config = {
  matcher: ["/dashboard/:path*", "/auth/signin", "/auth/register"],
}; 