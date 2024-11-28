// config/i18n.ts
import { I18n } from 'i18n'
import path from 'path'

const i18n = new I18n({
  locales: ['en'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '../locales'), // Adjust the path as needed
  queryParameter: 'lang',
  autoReload: true,
  objectNotation: true,
  register: global,
})

export default i18n
