import { NextRequest, NextResponse } from "next/server";
import { GrantError, rotateRefreshToken } from "@/lib/extension-auth";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { refresh_token?: string };
  try {
    const tokens = await rotateRefreshToken(String(body.refresh_token || ""));
    return NextResponse.json(tokens);
  } catch (error) {
    if (error instanceof GrantError) {
      return NextResponse.json({ error: "INVALID_GRANT" }, { status: 401 });
    }
    throw error;
  }
}
