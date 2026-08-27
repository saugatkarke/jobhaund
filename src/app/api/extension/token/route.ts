import { NextRequest, NextResponse } from "next/server";
import { GrantError, exchangeAuthorizationCode } from "@/lib/extension-auth";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    grant_type?: string;
    code?: string;
    code_verifier?: string;
    redirect_uri?: string;
  };
  if (body.grant_type !== "authorization_code") {
    return NextResponse.json({ error: "INVALID_GRANT" }, { status: 401 });
  }
  try {
    const tokens = await exchangeAuthorizationCode({
      code: String(body.code || ""),
      codeVerifier: String(body.code_verifier || ""),
      redirectUri: String(body.redirect_uri || ""),
    });
    return NextResponse.json(tokens);
  } catch (error) {
    if (error instanceof GrantError) {
      return NextResponse.json({ error: "INVALID_GRANT" }, { status: 401 });
    }
    throw error;
  }
}
