import { expect, it } from "vitest";
import { receiptLine } from "./Receipt";

it("describes payment time and next due date", () => {
  expect(receiptLine("2026-03-05T14:07:00", 30)).toBe(
    "Paid 5th March 2026 at 2:07 PM (Thu), next due 04/04/2026"
  );
});
