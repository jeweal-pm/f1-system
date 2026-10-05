import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { Request, Response } from "express";
import { AppModule } from "./app.module";
import { appRouter, type SessionUser, type TrpcContext } from "./trpc/router";

async function createContext({ req }: { req: Request; res: Response }): Promise<TrpcContext> {
  const cookie = req.headers.cookie;
  if (!cookie) return { session: null };

  try {
    const response = await fetch(`${process.env.AUTH_SERVICE_URL ?? "http://localhost:3101"}/api/auth/get-session`, {
      headers: { cookie },
      signal: AbortSignal.timeout(2_000),
    });
    if (!response.ok) return { session: null };
    const data: unknown = await response.json();
    if (typeof data !== "object" || data === null || !("user" in data)) return { session: null };
    const user = (data as { user?: unknown }).user;
    if (typeof user !== "object" || user === null) return { session: null };
    const record = user as Record<string, unknown>;
    if (typeof record.id !== "string" || typeof record.email !== "string" || typeof record.name !== "string") return { session: null };
    const sessionUser: SessionUser = { id: record.id, email: record.email, name: record.name, role: typeof record.role === "string" ? record.role : undefined };
    return { session: { user: sessionUser } };
  } catch {
    return { session: null };
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
  const express = app.getHttpAdapter().getInstance();
  express.use("/trpc", createExpressMiddleware({ router: appRouter, createContext }));
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port, "0.0.0.0");
}

void bootstrap();
