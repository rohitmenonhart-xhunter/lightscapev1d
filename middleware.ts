import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Simple middleware that just passes through all requests
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Empty config since we're not restricting any paths
export const config = {
  matcher: [],
}; 