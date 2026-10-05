import type { NextRequest } from "next/server";

export const runtime = "nodejs";

async function proxy(request: NextRequest) {
  const upstream = process.env.AUTH_SERVICE_URL ?? "http://localhost:3101";
  const target = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, upstream);
  return fetch(new Request(target, request));
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
