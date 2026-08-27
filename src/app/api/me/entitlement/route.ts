import { NextRequest, NextResponse } from "next/server";
import { entitlementPayload } from "@/lib/session-entitlement";

export async function GET(req: NextRequest) {
  const body = await entitlementPayload(req);
  return NextResponse.json(body);
}
