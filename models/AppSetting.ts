import mongoose from 'mongoose'
import { AppSetting } from '@/lib/types'

const AppSettingSchema = new mongoose.Schema({
  smtp_host: String,
  smtp_port: Number,
  smtp_username: String,
  smtp_password: String,
  sender_email: String,
  sender_name: String,
  reply_email: String
})

export default mongoose.models.AppSetting || mongoose.model<AppSetting>('AppSetting', AppSettingSchema)
