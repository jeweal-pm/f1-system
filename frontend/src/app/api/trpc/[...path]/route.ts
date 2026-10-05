import type { NextRequest } from "next/server";

export const runtime = "nodejs";

async function proxy(request: NextRequest) {
  const upstream = process.env.GATEWAY_URL ?? "http://localhost:4000";
  const target = new URL(`${request.nextUrl.pathname.replace(/^\/api\/trpc/, "/trpc")}${request.nextUrl.search}`, upstream);
  return fetch(new Request(target, request));
}

export const GET = proxy;
export const POST = proxy;
