import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const password = formData.get("password");

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return NextResponse.redirect("/admin?error=config_error");
    }

    if (password === adminPassword) {
      const cookieStore = await cookies();
      cookieStore.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.redirect("/admin");
    } else {
      return NextResponse.redirect("/admin?error=invalid_password");
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.redirect("/admin?error=server_error");
  }
}

