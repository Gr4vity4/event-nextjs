import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/dashboard")) {
    // Check for the token in cookies instead of headers
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Invalid token");
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
