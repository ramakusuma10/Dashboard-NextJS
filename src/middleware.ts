import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken'); // Cek token dari cookies atau localStorage
  const { pathname } = req.nextUrl;

  // Proteksi rute /dashboard dan semua turunannya
  if (pathname.startsWith('/') && !token) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirect ke login jika belum login
  }

  // Redirect pengguna yang sudah login dan mencoba akses login
  if (pathname.startsWith('/login') && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'], // Lindungi /dashboard dan halaman login
};