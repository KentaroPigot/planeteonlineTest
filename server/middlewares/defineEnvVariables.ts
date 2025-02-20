export default () => {
  process.env.JWT_SECRET
    ? process.env.JWT_SECRET
    : "DefaultSecret.YouShouldChangeIt";
  process.env.JWT_EXPIRES_IN ? process.env.JWT_EXPIRES_IN : "3600";
  process.env.JWT_COOKIE_EXPIRES_IN
    ? process.env.JWT_COOKIE_EXPIRES_IN
    : "3600";
  process.env.NODE_ENV ? process.env.NODE_ENV : "production";
  process.env.PORT ? process.env.PORT : "3080";
  process.env.DB_HOST ? process.env.DB_HOST : "localhost";
};
