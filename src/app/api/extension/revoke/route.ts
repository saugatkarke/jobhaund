import { NextRequest, NextResponse } from "next/server";
import { revokeRefreshToken } from "@/lib/extension-auth";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { refresh_token?: string };
  await revokeRefreshToken(String(body.refresh_token || "")).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
