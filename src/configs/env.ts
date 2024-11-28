import { cleanEnv, port, str } from 'envalid'

const env = cleanEnv(process.env, {
  PORT: port({ default: 8000 }),
  FRONTEND_URL: str({ default: 'https://localhost:3000' }),
  MONGODB_URI: str({ default: 'mongodb://127.0.0.1:27017/userDB' }),
  TOKEN_SECRET: str({ default: 'mySecretToken' }),
  NODE_ENV: str({default:'development', choices: ['development', 'test', 'production', 'staging', 'local'] }),
  APPLICATION_NAME: str({default:'VRV'}),
  SMTP_EMAIL: str({default:'kartikey.saraswat301@gmail.com'}),
  APP_URL: str({ default: 'http://localhost:8000' }),
  // Google
  GOOGLE_CLIENT_ID: str({default:'22520847803-mqg7940f3d9lqjts3qliukfgo3djjva3.apps.googleusercontent.com'}),
  GOOGLE_CLIENT_SECRET: str({default:'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'}),
  SMTP_GOOGLE_EMAIL: str({default:'kartikey.saraswat301@gmail.com'}),
  SMTP_GOOGLE_PASSWORD: str({default:''}),
})

export default env
