import { describe, it, expect } from "vitest";
import { handleRequest } from "../src/index";

function get(path: string): Response {
  return handleRequest(new Request(`https://gencal.example${path}`));
}

describe("routing", () => {
  it("serves the current month at /", async () => {
    const res = get("/");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/svg+xml");
    expect(await res.text()).toContain("<svg");
  });

  it("serves a dated month", async () => {
    const res = get("/2023/5");
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("image/svg+xml");
    expect(await res.text()).toContain(">MAY 2023<");
  });

  it("accepts a zero-padded month", async () => {
    const res = get("/2023/05");
    expect(res.status).toBe(200);
    expect(await res.text()).toContain(">MAY 2023<");
  });
});

describe("caching", () => {
  it("does not cache the current-month route", () => {
    const res = get("/");
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("caches a dated route immutably", () => {
    const res = get("/2023/5");
    expect(res.headers.get("cache-control")).toBe(
      "public, max-age=31536000, immutable",
    );
  });
});

describe("error parity", () => {
  it("returns 400 for an out-of-range month", async () => {
    const res = get("/2023/13");
    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Invalid year or month");
  });

  it("returns 400 for month 0", async () => {
    const res = get("/2023/0");
    expect(res.status).toBe(400);
  });

  it("returns 400 for non-numeric input", async () => {
    const res = get("/abc/def");
    expect(res.status).toBe(400);
    expect(await res.text()).toBe("Invalid year or month");
  });

  it("returns 404 for an unknown route", async () => {
    const res = get("/foo/bar/baz");
    expect(res.status).toBe(404);
    expect(await res.text()).toBe("Sorry, this page doesn't exist.");
  });

  it("returns 404 for a single unknown segment", async () => {
    const res = get("/nope");
    expect(res.status).toBe(404);
  });
});
