import { describe, expect, it } from "vitest";
import { emptyEntitlement, resolveEntitlement } from "./entitlement";

const now = Date.parse("2026-08-24T00:00:00.000Z");

describe("resolveEntitlement", () => {
  it("is free when row is null", () => {
    expect(resolveEntitlement(null, now)).toEqual(emptyEntitlement());
  });

  it("is pro when active", () => {
    const r = resolveEntitlement(
      {
        plan: "pro",
        status: "active",
        currentPeriodEnd: "2026-09-24T00:00:00.000Z",
      },
      now,
    );
    expect(r.plan).toBe("pro");
    expect(r.features.hideJobs).toBe(true);
    expect(r.features.atsResults).toBe(true);
  });

  it("is pro when trialing", () => {
    expect(
      resolveEntitlement(
        { plan: "pro", status: "trialing", currentPeriodEnd: "2026-09-01T00:00:00.000Z" },
        now,
      ).plan,
    ).toBe("pro");
  });

  it("is pro when past_due", () => {
    expect(
      resolveEntitlement(
        { plan: "pro", status: "past_due", currentPeriodEnd: "2026-09-01T00:00:00.000Z" },
        now,
      ).plan,
    ).toBe("pro");
  });

  it("is pro when canceled but period has not ended", () => {
    expect(
      resolveEntitlement(
        { plan: "pro", status: "canceled", currentPeriodEnd: "2026-09-01T00:00:00.000Z" },
        now,
      ).plan,
    ).toBe("pro");
  });

  it("is free when canceled and period ended", () => {
    expect(
      resolveEntitlement(
        { plan: "pro", status: "canceled", currentPeriodEnd: "2026-08-01T00:00:00.000Z" },
        now,
      ).plan,
    ).toBe("free");
  });

  it("is free when paused", () => {
    expect(
      resolveEntitlement(
        { plan: "pro", status: "paused", currentPeriodEnd: "2026-09-01T00:00:00.000Z" },
        now,
      ).plan,
    ).toBe("free");
  });
});
