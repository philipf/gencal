import { generateSvgCalendar } from "./calendar";

// gencal Cloudflare Worker.
// Slice 1 (walking skeleton): serves the current month at `/`.
// The dated route, full error parity, and caching arrive in later slices.
export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      const now = new Date();
      const svg = generateSvgCalendar(now.getUTCFullYear(), now.getUTCMonth() + 1);
      return new Response(svg, {
        headers: { "content-type": "image/svg+xml" },
      });
    }

    return new Response("Sorry, this page doesn't exist.", { status: 404 });
  },
} satisfies ExportedHandler;
