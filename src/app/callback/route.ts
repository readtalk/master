import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const cookieStore = await cookies();
  const verifier = cookieStore.get("code_verifier")?.value;
  if (!verifier) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const tokenResponse = await fetch("https://auth.readtalk.web.id/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://app.readtalk.web.id/callback",
        client_id: "your-client-id",
        code_verifier: verifier,
      }),
    });

    const data = await tokenResponse.json() as { access_token?: string };
    if (data.access_token) {
      return NextResponse.redirect(new URL(`/?token=${data.access_token}`, request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
