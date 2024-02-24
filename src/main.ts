import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { environment } from "./environment/environment";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, abortOnError: false });
  app.enableCors({
    origin: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
      .setTitle(environment.SWAGGER_TITLE)
      .setDescription('A API do Help-us')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(environment.PORT || 3000);
}
bootstrap();
