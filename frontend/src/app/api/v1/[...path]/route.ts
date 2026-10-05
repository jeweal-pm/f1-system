import type { NextRequest } from "next/server";

export const runtime = "nodejs";

async function proxy(request: NextRequest) {
  const upstream = process.env.GATEWAY_URL ?? "http://localhost:4000";
  const path = request.nextUrl.pathname.replace(/^\/api\/v1/, "/api/v1");
  return fetch(new Request(new URL(`${path}${request.nextUrl.search}`, upstream), request));
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
