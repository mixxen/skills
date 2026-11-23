import { describe, expect, it } from "vitest";
import { formatDueDate, isOverdue } from "./format";

describe("formatDueDate", () => {
  it("formats as day, short month, year", () => {
    expect(formatDueDate("2026-03-05T10:00:00Z")).toBe("05 Mar 2026");
  });
});

describe("isOverdue", () => {
  it("is true for yesterday", () => {
    expect(isOverdue("2026-03-04", new Date("2026-03-05T12:00:00Z"))).toBe(true);
  });
});
