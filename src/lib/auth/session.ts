// lib/auth/session.ts
import { auth } from "./auth";
import type { ExtendedUser } from "./auth";

export async function getSession() {
  return await auth();
}

export async function getCurrentUser() {
  const session = await getSession();

  return session?.user as ExtendedUser | undefined;
}

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/" ||
    path.startsWith("/products") ||
    path.startsWith("/categories") ||
    path.startsWith("/suppliers");

  // Get the token if it exists
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to login if not authenticated and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to appropriate dashboard if trying to access login/register while authenticated
  if (token && (path === "/login" || path === "/register")) {
    return redirectToDashboard(token.userType as string, request.url);
  }

  // Role-based access control for dashboard routes
  if (token && path.startsWith("/admin") && token.userType !== "admin") {
    return redirectToDashboard(token.userType as string, request.url);
  }

  if (token && path.startsWith("/supplier") && token.userType !== "supplier") {
    return redirectToDashboard(token.userType as string, request.url);
  }

  if (
    token &&
    path.startsWith("/project-owner") &&
    token.userType !== "projectOwner"
  ) {
    return redirectToDashboard(token.userType as string, request.url);
  }

  return NextResponse.next();
}

function redirectToDashboard(userType: string, baseUrl: string) {
  switch (userType) {
    case "admin":
      return NextResponse.redirect(new URL("/admin", baseUrl));
    case "supplier":
      return NextResponse.redirect(new URL("/supplier", baseUrl));
    case "projectOwner":
      return NextResponse.redirect(new URL("/project-owner", baseUrl));
    default:
      return NextResponse.redirect(new URL("/", baseUrl));
  }
}

// Match all protected routes
export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",
    "/supplier/:path*",
    "/project-owner/:path*",
    "/dashboard/:path*",
  ],
};
