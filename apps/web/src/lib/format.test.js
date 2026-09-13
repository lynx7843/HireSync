import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, initialsFromName, statusLabel } from "./format";

describe("formatDate", () => {
  it("formats a valid date", () => {
    expect(formatDate("2026-09-01T12:00:00Z")).toBe("Sep 01, 2026");
  });

  it("returns a dash for empty or invalid input", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate("")).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });
});

describe("formatDateTime", () => {
  it("includes the date for a valid value", () => {
    expect(formatDateTime("2026-09-01T12:00:00Z")).toContain("2026");
  });

  it("returns a dash for empty or invalid input", () => {
    expect(formatDateTime(undefined)).toBe("—");
    expect(formatDateTime("not-a-date")).toBe("—");
  });
});

describe("statusLabel", () => {
  it("capitalises the status", () => {
    expect(statusLabel("interview")).toBe("Interview");
  });

  it("falls back to Unknown", () => {
    expect(statusLabel("")).toBe("Unknown");
  });
});

describe("initialsFromName", () => {
  it("uses the first and last name", () => {
    expect(initialsFromName("ada king lovelace")).toBe("AL");
  });

  it("handles a single name and extra whitespace", () => {
    expect(initialsFromName("  ada  ")).toBe("A");
  });

  it("falls back to ? for an empty name", () => {
    expect(initialsFromName("")).toBe("?");
  });
});
