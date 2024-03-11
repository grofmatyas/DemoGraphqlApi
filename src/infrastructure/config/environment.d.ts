declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // required envs

      // optional envs
      LISTEN_ON?: string;
      ORIGIN?: string;
      NODE_ENV?: string;
      ENVIRONMENT?: string;
      CLIENT_ORIGINS?: string;
      WORKER_ID?: string;

      ELASTIC_HOST?: string;
      ELASTIC_USERNAME?: string;
      ELASTIC_PASSWORD?: string;
    }
  }
}

export {};
