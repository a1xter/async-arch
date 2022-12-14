import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './db/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  app.enableCors();
  await app.listen(parseInt(process.env.PORT, 10) || 8080);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
}

bootstrap().then(() => {
  console.log(`app started on port: ${parseInt(process.env.PORT, 10) || 8080}`);
});
