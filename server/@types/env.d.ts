// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DB_HOST: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    PORT: number;

    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    JWT_COOKIE_EXPIRES_IN: string;
    JWT_REFRESH_COOKIE_EXPIRES_IN: string;
  }
}
