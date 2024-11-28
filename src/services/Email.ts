import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import transporter from '../configs/nodemailer'
export const sendEMail = async (email: string, template: string, subject: string, data: any = {}, pdfUrl?: string | undefined) => {
  try {
    const dynamicTemplate = ejs.compile(fs.readFileSync(path.join(__dirname, '..', 'utils', 'templates', `${template}.ejs`), 'utf8'))
    const htmlContent = dynamicTemplate(data)

    await transporter.sendMail({
      to: email,
      subject,
      html: htmlContent,
    })
  } catch (error) {
    console.log(error)
  }
}
