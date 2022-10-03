import { Kafka } from 'kafkajs';

export function getKafkaClient() {
  return new Kafka({
    clientId: 'async-arc-kafka',
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: process.env.KAFKA_USER,
      password: process.env.KAFKA_PASSWORD,
    },
  });
}
