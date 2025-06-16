import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/",
  "genre",
  "song-format",
  "/dashboard",
  "/songs",
  "/mood",
  "/orders",
  "/song-language",
  "/update-profile",
  "/update-password",
  "/bookings",
  "/users",
  "/users/create",
  "/users/edit/*",
  "/musicians",
  "/musicians/create",
  "/musicians/edit/[id]",
  "/faq",
  "/faq/edit/",
  "/faq/create",
  "/terms",
  "/terms/create",
  "/privacy",
  "/privacy/create",
];
const publicRoutes = [
  "/login",
  "/forgot-password",
  "reset-password",
  "/verify",
];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (isProtectedRoute && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/update-profile", req.nextUrl));
  }

  return NextResponse.next();
}
