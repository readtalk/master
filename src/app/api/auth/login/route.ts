import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const verifier = crypto.randomBytes(32).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");

  const cookieStore = await cookies();
  cookieStore.set("code_verifier", verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  const authUrl = new URL("https://auth.readtalk.web.id/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", "your-client-id");
  authUrl.searchParams.set("redirect_uri", "https://app.readtalk.web.id/callback");
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  return NextResponse.redirect(authUrl);
}
