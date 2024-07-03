'use server'

import dbConnect from '@/lib/db/mongoose'
import AppSetting from '@/models/AppSetting'

export async function getSettings() {
  try {
    await dbConnect()
    const appSetting = await AppSetting.findOne({})

    if (!appSetting) return null
    return appSetting
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function getSmtpSettings() {
  const appSettings = await getSettings()
  if (!appSettings) return null
  const { smtp_host, smtp_port, smtp_username, smtp_password, sender_email, sender_name, reply_email } = appSettings
  return { smtp_host, smtp_port, smtp_username, smtp_password, sender_email, sender_name, reply_email }
}

export async function updateSmtpSettings({
  host,
  port,
  user,
  pass,
  sender_email,
  sender_name,
  reply_email
}: {
  host: string
  port: string
  user: string
  pass: string
  sender_email: string
  sender_name: string
  reply_email: string
}) {
  try {
    await dbConnect()
    const appSetting = await AppSetting.findOne({})

    if (!appSetting) {
      const newone = new AppSetting({
        smtp_host: host,
        smtp_port: port,
        smtp_username: user,
        smtp_password: pass,
        sender_email: sender_email,
        sender_name: sender_name,
        reply_email: reply_email
      })
      await newone.save()
      return 'success'
    }

    appSetting.smtp_host = host
    appSetting.smtp_port = port
    appSetting.smtp_username = user
    appSetting.smtp_password = pass
    appSetting.sender_email = sender_email
    appSetting.sender_name = sender_name
    appSetting.reply_email = reply_email
    await appSetting.save()
    return 'success'
  } catch (e) {
    console.log(e)
    return null
  }
}
