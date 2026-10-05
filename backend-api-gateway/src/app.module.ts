import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [LoggerModule.forRoot({ pinoHttp: { redact: { paths: ["req.headers.authorization", "req.headers.x-api-key", "req.body.password"], censor: "[REDACTED]" } } })],
  controllers: [AppController],
})
export class AppModule {}
