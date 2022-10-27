import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microserviceTCP = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 3001,
    },
  });

  const microserviceKafka = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap().then(() => {
  console.log(
    `App: Billing service - started on port ${
      process.env.PORT ? parseInt(process.env.PORT, 10) : 'default'
    }`,
  );
});
