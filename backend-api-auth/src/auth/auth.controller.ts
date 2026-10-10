import { Body, Controller, Get, Headers, HttpCode, HttpException, HttpStatus, Ip, Post, Put, Req } from "@nestjs/common";
import type { Request } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("health/live")
  live() { return { status: "ok" }; }

  @Get("health/ready")
  async ready() {
    await auth.$context;
    return { status: "ok", dependencies: { database: "ok" } };
  }

  @Post("api/v1/users")
  @HttpCode(HttpStatus.CREATED)
  createUser(@Headers("x-api-key") apiKey: string | undefined, @Body() body: unknown) {
    return this.authService.createUser(apiKey, body);
  }

  @Post("api/v1/auth/forgot-password")
  @HttpCode(HttpStatus.ACCEPTED)
  async forgotPassword(@Body() body: unknown, @Ip() ip: string) {
    try {
      await this.authService.forgotPassword(body, ip);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      // Keep an accepted response for existing addresses and SMTP failures alike.
    }
    return { accepted: true, message: "หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งรหัสผ่านใหม่ไปให้แล้ว" };
  }

  @Put("api/v1/me/password")
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(@Req() request: Request, @Body() body: unknown) {
    const headers = fromNodeHeaders(request.headers);
    const session = await auth.api.getSession({ headers });
    if (!session) throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    const input = this.authService.validatePasswordChange(body);
    const result = await auth.api.changePassword({
      headers,
      body: { currentPassword: input.currentPassword, newPassword: input.newPassword, revokeOtherSessions: false },
      asResponse: true,
    });
    if (!result.ok) {
      const details = await result.json().catch(() => null) as { code?: string; message?: string } | null;
      if (details?.code === "INVALID_PASSWORD") throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      throw new HttpException(details ?? "Could not update password", result.status);
    }
    await auth.api.revokeOtherSessions({ headers });
  }
}
