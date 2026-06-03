import { generateSvgCalendar } from "./calendar";

// gencal Cloudflare Worker.
// Routes:
//   GET /               -> current month
//   GET /<year>/<month> -> specified month (padded or unpadded)
// Error parity with the original Flask app:
//   invalid year/month  -> 400 "Invalid year or month"
//   unknown route       -> 404 "Sorry, this page doesn't exist."

const INVALID_MESSAGE = "Invalid year or month";
const NOT_FOUND_MESSAGE = "Sorry, this page doesn't exist.";

// Match Python's datetime() bounds: year 1-9999, month 1-12.
const MIN_YEAR = 1;
const MAX_YEAR = 9999;

/** Parse a path segment as a non-negative integer, or null if it isn't one. */
function parseSegment(segment: string): number | null {
  if (!/^\d+$/.test(segment)) return null;
  return Number(segment);
}

function isValidYearMonth(year: number, month: number): boolean {
  return year >= MIN_YEAR && year <= MAX_YEAR && month >= 1 && month <= 12;
}

function svgResponse(year: number, month: number): Response {
  return new Response(generateSvgCalendar(year, month), {
    headers: { "content-type": "image/svg+xml" },
  });
}

export function handleRequest(request: Request): Response {
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter((s) => s.length > 0);

  // GET / -> current month.
  if (segments.length === 0) {
    const now = new Date();
    return svgResponse(now.getUTCFullYear(), now.getUTCMonth() + 1);
  }

  // GET /<year>/<month> -> specified month.
  if (segments.length === 2) {
    const year = parseSegment(segments[0]);
    const month = parseSegment(segments[1]);
    if (year === null || month === null || !isValidYearMonth(year, month)) {
      return new Response(INVALID_MESSAGE, { status: 400 });
    }
    return svgResponse(year, month);
  }

  return new Response(NOT_FOUND_MESSAGE, { status: 404 });
}

export default {
  fetch(request: Request): Response {
    return handleRequest(request);
  },
} satisfies ExportedHandler;
