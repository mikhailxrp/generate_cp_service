import { NextResponse } from "next/server";

const TOKEN_NAME = "auth-token";

export function middleware(req) {
  const { pathname, searchParams } = req.nextUrl;

  // Разрешённые пути (не требуют авторизации)
  const publicPaths = ["/login", "/api/user/public"];

  // Если путь в списке публичных - пропускаем
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Проверяем наличие токена авторизации
  const token = req.cookies.get(TOKEN_NAME);
  const isLoggedIn = token !== undefined;

  // Если НЕ авторизован - редирект на /login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Авторизован - пропускаем
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (images, svg, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp|.*\\.ico|brand/).*)",
  ],
};
