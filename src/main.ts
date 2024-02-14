import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './configs/app.config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfig);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('EDI processing')
    .setDescription('EDI processing swagger')
    .setVersion('v1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.port, '0.0.0.0');
  console.log(
    `Swagger is available on: http://localhost:${appConfig.port}/api`,
  );
}

bootstrap();
