import { NestFactory } from "@nestjs/core";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

import cookieParser from "cookie-parser";
import { ValidationError } from "class-validator";
import { formatValidationErrors } from "./common/utils/validation.utils";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: process.env.CLIENT_ORIGIN, credentials: true });
  app.setGlobalPrefix("api");

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException(formatValidationErrors(errors)),
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
