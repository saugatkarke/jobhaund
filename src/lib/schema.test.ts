import { getTableColumns } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { account } from "./schema";

describe("better-auth schema compatibility", () => {
  it("includes issuer column on account table", () => {
    const columns = getTableColumns(account);
    expect(columns.issuer).toBeDefined();
  });
});
