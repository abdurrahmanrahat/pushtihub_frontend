import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { accessAuthKey } from "./constants/authKey";
import { decodedToken } from "./utils/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = (await cookies()).get(accessAuthKey)?.value;

  // 🔒 Redirect to /login if not logged in and accessing protected routes
  if (!accessToken) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  let userInfo;
  try {
    userInfo = decodedToken(accessToken) as any;
  } catch (error) {
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!userInfo?.role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Role-Based Access Control for dashboard
  if (pathname.startsWith("/dashboard")) {
    if (userInfo.role === "admin") {
      if (pathname.startsWith("/dashboard/admin")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    // if (userInfo.role === "user") {
    //   if (pathname.startsWith("/dashboard/user")) {
    //     return NextResponse.next();
    //   }
    //   return NextResponse.redirect(new URL("/", request.url));
    // }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
