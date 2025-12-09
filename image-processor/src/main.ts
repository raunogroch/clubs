import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import * as bodyParser from "body-parser";
import { AppModule } from "./app.module";
import { join } from "path";
import * as express from "express";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const logger = new Logger("ImageProcessorApps");

  app.use("/storage", express.static(join(__dirname, "../storage")));
  app.use("/images", express.static(join(__dirname, "../images")));

  app.enableCors();
  app.use(bodyParser.json({ limit: "20mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));

  const port = process.env.PORT || 4000;

  logger.log(`Listening on port ${port}`);
  await app.listen(port);
}

bootstrap();
