declare namespace NodeJS {
  export interface ProcessEnv {
    PORT?: string;
    DATABASE_URL?: string;
    POSTGRES_USER?: string;
    POSTGRES_PASSWORD?: string;
    POSTGRES_DB?: string;
    KAFKA_BROKER?: string;
    KAFKA_USER?: string;
    KAFKA_PASSWORD?: string;
  }
}
