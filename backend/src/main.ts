import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Приложение Expo обращается с телефона — разрешаем запросы отовсюду на старте.
  // На проде сузь origin до адреса своего приложения.
  app.enableCors();

  // Валидация входящих DTO по декораторам class-validator.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Remont backend запущен на http://localhost:${port}`);
}
bootstrap();
