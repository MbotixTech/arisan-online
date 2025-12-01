import { NextRequest, NextResponse } from "next/server";
import { updateSession, decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  let session = null;
  if (sessionCookie) {
    try {
      session = await decrypt(sessionCookie);
    } catch (e) {
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/static") ||
    request.nextUrl.pathname.endsWith(".png") ||
    request.nextUrl.pathname.endsWith(".ico") ||
    request.nextUrl.pathname.endsWith(".svg")
  ) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
