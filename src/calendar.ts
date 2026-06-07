// Core calendar logic, ported from the original Python gencal.py.
// Produces an SVG month calendar as a string — no runtime dependencies.

// Monday-first ordering, matching Python's calendar module defaults.
const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Layout constants ported verbatim from gencal.py.
const CELL_SIZE = 90;
const HEADER_HEIGHT = 20;
const FONT_FAMILY = "Arial";
const FONT_FILL = "black";

/**
 * Build a month grid as weeks of 7 day-numbers, Monday-first.
 * Days outside the month are 0 (padding), matching Python's
 * calendar.monthcalendar.
 */
export function monthCalendar(year: number, month: number): number[][] {
  // Use UTC so the result is independent of the runtime timezone.
  // getUTCDay: 0=Sunday..6=Saturday -> shift to 0=Monday..6=Sunday.
  const firstWeekday = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const weeks: number[][] = [];
  let week = new Array(7).fill(0) as number[];
  let day = 1;

  // First (possibly partial) week.
  for (let col = firstWeekday; col < 7 && day <= daysInMonth; col++) {
    week[col] = day++;
  }
  weeks.push(week);

  // Remaining weeks.
  while (day <= daysInMonth) {
    week = new Array(7).fill(0) as number[];
    for (let col = 0; col < 7 && day <= daysInMonth; col++) {
      week[col] = day++;
    }
    weeks.push(week);
  }

  return weeks;
}

/**
 * Generate an SVG calendar for the given year and month (month is 1-12).
 * Visually equivalent to the original svgwrite output.
 */
export function generateSvgCalendar(year: number, month: number): string {
  const weeks = monthCalendar(year, month);

  const width = CELL_SIZE * 7 + 20;
  const height = HEADER_HEIGHT + CELL_SIZE * (weeks.length + 1);

  const parts: string[] = [];

  // Centred, bold title: "{Month} {Year}".
  const titleText = `${MONTH_NAMES[month - 1].toUpperCase()} ${year}`;
  const titleX = (CELL_SIZE * 7) / 2 + 10;
  const titleY = HEADER_HEIGHT / 2 + 10;
  parts.push(
    `<text x="${titleX}" y="${titleY}" font-size="20px" fill="${FONT_FILL}" ` +
      `text-anchor="middle" font-weight="bold" font-family="${FONT_FAMILY}">${titleText}</text>`,
  );

  // Grid: row 0 is the weekday header, rows 1..n are the weeks.
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= weeks.length; row++) {
      const isHeader = row === 0;

      const cellX = 10 + col * CELL_SIZE;
      const cellY = isHeader ? 40 : HEADER_HEIGHT + 40 + (row - 1) * CELL_SIZE;
      const cellH = isHeader ? HEADER_HEIGHT : CELL_SIZE;

      // Cell border.
      parts.push(
        `<rect x="${cellX}" y="${cellY}" width="${CELL_SIZE}px" height="${cellH}px" ` +
          `stroke-width="0.5" stroke="grey" fill="none" />`,
      );

      // Cell text: weekday name (header) or day number (if part of the month).
      const dayNumber = isHeader ? 0 : weeks[row - 1][col];
      if (isHeader || dayNumber !== 0) {
        const fontSize = isHeader ? "12px" : "10px";
        const fontWeight = isHeader ? "bold" : "normal";
        const textX = isHeader ? 15 + col * CELL_SIZE : 13 + col * CELL_SIZE;
        const textY = isHeader
          ? HEADER_HEIGHT + 35
          : HEADER_HEIGHT + 40 + (row - 1) * CELL_SIZE + 13;
        const content = isHeader ? DAY_NAMES[col] : String(dayNumber);
        parts.push(
          `<text x="${textX}" y="${textY}" font-size="${fontSize}" fill="${FONT_FILL}" ` +
            `font-weight="${fontWeight}" font-family="${FONT_FAMILY}">${content}</text>`,
        );
      }

      // Weekend shading (Saturday/Sunday = columns 5/6), drawn over the cell.
      if (!isHeader && (col === 5 || col === 6)) {
        parts.push(
          `<rect x="${cellX}" y="${cellY}" width="${CELL_SIZE}px" height="${cellH}px" ` +
            `stroke-width="0.5" stroke="grey" fill="lightgrey" opacity="0.3" />`,
        );
      }
    }
  }

  return (
    `<?xml version="1.0" encoding="utf-8" ?>\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${height}px">` +
    parts.join("") +
    `</svg>`
  );
}
