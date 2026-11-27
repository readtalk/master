import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  try {
    const parts = session.split(".");
    if (parts.length < 2) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    const userId = payload.properties?.id || payload.sub;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const res = await fetch("https://auth.readtalk.web.id/settings", {
      headers: { Authorization: `Bearer ${session}` },
    });
    const data = await res.json() as { success?: boolean; user?: unknown };
    if (data.success && data.user) {
      return NextResponse.json({ success: true, user: data.user });
    }
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
