import { Kafka } from 'kafkajs';

export function getKafkaClient() {
  return new Kafka({
    clientId: `async-arc-billing`,
    brokers: [process.env.KAFKA_BROKER ? process.env.KAFKA_BROKER : '']
  });
}
