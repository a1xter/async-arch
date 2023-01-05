import { Kafka } from 'kafkajs';

export function getKafkaClient() {
  return new Kafka({
    clientId: 'async-arc-auth',
    brokers: [process.env.KAFKA_BROKER]
  });
}
