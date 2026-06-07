import { describe, it, expect } from "vitest";
import { monthCalendar, generateSvgCalendar } from "../src/calendar";

describe("monthCalendar", () => {
  it("orders weeks Monday-first", () => {
    // 1 May 2023 is a Monday -> it must land in column 0.
    const weeks = monthCalendar(2023, 5);
    expect(weeks[0][0]).toBe(1);
  });

  it("places a Sunday-starting month correctly (Sunday is column 6)", () => {
    // 1 Oct 2023 is a Sunday -> column 6 of the first week.
    const weeks = monthCalendar(2023, 10);
    expect(weeks[0][6]).toBe(1);
    expect(weeks[0].slice(0, 6)).toEqual([0, 0, 0, 0, 0, 0]);
  });

  it("handles a leap-year February (29 days)", () => {
    const weeks = monthCalendar(2024, 2);
    const days = weeks.flat().filter((d) => d !== 0);
    expect(days).toHaveLength(29);
    expect(Math.max(...days)).toBe(29);
  });

  it("handles a non-leap February (28 days)", () => {
    const weeks = monthCalendar(2023, 2);
    const days = weeks.flat().filter((d) => d !== 0);
    expect(days).toHaveLength(28);
  });

  it("handles a 31-day month", () => {
    const weeks = monthCalendar(2023, 1);
    const days = weeks.flat().filter((d) => d !== 0);
    expect(days).toHaveLength(31);
    expect(Math.max(...days)).toBe(31);
  });
});

describe("generateSvgCalendar", () => {
  it("produces a valid SVG document", () => {
    const svg = generateSvgCalendar(2023, 5);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
  });

  it("includes the month/year title", () => {
    const svg = generateSvgCalendar(2023, 5);
    expect(svg).toContain(">MAY 2023<");
  });

  it("includes Monday-first weekday headers", () => {
    const svg = generateSvgCalendar(2023, 5);
    expect(svg).toContain(">Monday<");
    expect(svg).toContain(">Sunday<");
  });

  it("applies weekend shading", () => {
    const svg = generateSvgCalendar(2023, 5);
    expect(svg).toContain('fill="lightgrey"');
    expect(svg).toContain('opacity="0.3"');
  });

  it("renders day numbers", () => {
    const svg = generateSvgCalendar(2023, 5);
    expect(svg).toContain(">31<");
  });
});
