import { Controller, Get, HttpException, HttpStatus, Post, Put, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";

@Controller()
export class AppController {
  @Get("health/live")
  live() {
    return { status: "ok" };
  }

  @Get("health/ready")
  async ready() {
    try {
      const response = await fetch(`${process.env.AUTH_SERVICE_URL ?? "http://localhost:3101"}/health/ready`, { signal: AbortSignal.timeout(2_000) });
      if (!response.ok) throw new Error("auth service unhealthy");
      return { status: "ok", dependencies: { auth: "ok" } };
    } catch {
      throw new HttpException({ status: "not_ready", dependencies: { auth: "unavailable" } }, HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  @Post("api/v1/users")
  async createUser(@Req() request: Request, @Res() response: Response) {
    return this.forwardToAuth("/api/v1/users", request, response);
  }

  @Post("api/v1/auth/forgot-password")
  async forgotPassword(@Req() request: Request, @Res() response: Response) {
    return this.forwardToAuth("/api/v1/auth/forgot-password", request, response);
  }

  @Put("api/v1/me/password")
  async changePassword(@Req() request: Request, @Res() response: Response) {
    return this.forwardToAuth("/api/v1/me/password", request, response);
  }

  private async forwardToAuth(path: string, request: Request, response: Response) {
    const target = `${process.env.AUTH_SERVICE_URL ?? "http://localhost:3101"}${path}`;
    let upstream: globalThis.Response;
    try {
      upstream = await fetch(target, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": request.header("x-api-key") ?? "",
        },
        body: JSON.stringify(request.body),
        signal: AbortSignal.timeout(5_000),
      });
    } catch {
      throw new HttpException("User service unavailable", HttpStatus.BAD_GATEWAY);
    }
    const retryAfter = upstream.headers.get("retry-after");
    if (retryAfter) response.setHeader("retry-after", retryAfter);
    if (upstream.status === HttpStatus.NO_CONTENT) {
      response.status(HttpStatus.NO_CONTENT).end();
      return;
    }
    response.status(upstream.status).type("application/json").send(await upstream.text());
  }
}
