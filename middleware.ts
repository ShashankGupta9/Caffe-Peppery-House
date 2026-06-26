import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // Check admin role
    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!user || user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*"],
};
