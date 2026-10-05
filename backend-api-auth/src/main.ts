import "reflect-metadata";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";
import { auth } from "./auth/auth";

async function bootstrap() {
  if (process.env.NODE_ENV === "production" && (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)) {
    throw new Error("AUTH_SECRET must contain at least 32 characters in production");
  }
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.use("/api/auth", toNodeHandler(auth));
  expressApp.use(express.json({ limit: "32kb" }));
  await app.listen(Number(process.env.PORT ?? 3101), "0.0.0.0");
}

void bootstrap();
