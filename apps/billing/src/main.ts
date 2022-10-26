import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './db/prisma.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      }
    }
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen();
}



bootstrap().then(() => {
  console.log(
    `App: Billing service - started on port ${process.env.PORT ? parseInt(process.env.PORT, 10) : 'default'}`,
  );
});
