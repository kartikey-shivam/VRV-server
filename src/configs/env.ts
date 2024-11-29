import { cleanEnv, port, str } from 'envalid'

const env = cleanEnv(process.env, {
  PORT: port({ default: 8000 }),
  FRONTEND_URL: str({ default: 'https://localhost:3000' }),
  MONGODB_URI: str({ default: 'mongodb://127.0.0.1:27017/userDB' }),
  TOKEN_SECRET: str({ default: 'mySecretToken' }),
  NODE_ENV: str({default:'development', choices: ['development', 'test', 'production', 'staging', 'local'] }),
  APPLICATION_NAME: str({default:'VRV'}),
  SMTP_EMAIL: str(),
  APP_URL: str({ default: 'http://localhost:8000' }),
  // Google
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  SMTP_GOOGLE_EMAIL: str(),
  SMTP_GOOGLE_PASSWORD: str(),
})

export default env
