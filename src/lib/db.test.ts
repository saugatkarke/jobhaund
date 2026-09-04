import { describe, expect, it } from "vitest";
import { postgresClientOptions } from "./db";

describe("postgresClientOptions", () => {
  it("disables prepared statements for Neon serverless", () => {
    expect(postgresClientOptions).toEqual({ max: 1, prepare: false });
  });
});
