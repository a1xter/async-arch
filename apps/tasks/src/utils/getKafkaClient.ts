import { Kafka } from 'kafkajs';

export function getKafkaClient() {
  return new Kafka({
    clientId: 'async-arc-tasks',
    brokers: [process.env.KAFKA_BROKER ? process.env.KAFKA_BROKER : '']
  });
}
