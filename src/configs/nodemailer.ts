import nodemailer from 'nodemailer'
import env from './env'
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: env.SMTP_GOOGLE_EMAIL,
    pass: env.SMTP_GOOGLE_PASSWORD,
  },
})
export default transporter
