'use server'
import connectToDatabase from '@/lib/db/mongoose'
import EmailSettingModel from '@/models/EmailSetting'

//@ts-ignore
import nodemailer from 'nodemailer'
import { string } from 'zod'
import { getSmtpSettings } from './app_settings'

const sendEmail = async ({
  host,
  port,
  user,
  pass,
  from,
  reply_to,
  to,
  subject,
  body
}: {
  host: string
  port: string
  user: string
  pass: string
  from?: string
  reply_to?: string
  to: string
  subject: string
  body: string
}) => {
  try {
    const config = {
      host,
      port,
      auth: { user, pass }
    }
    const transport = nodemailer.createTransport(config)
    const msg = { from, to, subject, body }
    await transport.sendMail(msg)
    return 'success'
  } catch (e) {
    if (e instanceof Error) return e.message
  }
}

export const sendTestEmail = async ({
  host,
  port,
  user,
  pass,
  from,
  reply_to,
  to
}: {
  host: string
  port: string
  user: string
  pass: string
  from?: string
  reply_to?: string
  to: string
}) => {
  const sentResult = await sendEmail({
    host,
    port,
    user,
    pass,
    from,
    reply_to,
    to,
    subject: 'Test mail from ImpactGpt',
    body: `This is test email. sent at ${JSON.stringify(new Date())}`
  })
  return sentResult
}

export const sendEasyEmail = async ({
  from,
  to,
  reply_to,
  subject,
  body
}: {
  from?: string
  to: string
  reply_to?: string
  subject: string
  body: string
}) => {
  const smtpSettings = await getSmtpSettings()
  if (!smtpSettings) return 'SMTP settings not valid'

  const res = await sendEmail({
    host: smtpSettings.smtp_host,
    port: smtpSettings.smtp_port,
    user: smtpSettings.smtp_username,
    pass: smtpSettings.smtp_password,
    from,
    to,
    reply_to,
    subject,
    body
  })

  return res
}

export const sendOTPEmail = async (to: string, otp: string) => {
  await connectToDatabase()
  const [otpTemplate] = await EmailSettingModel.find({ name: 'Login Email Template' })

  await sendEasyEmail({ to, subject: otpTemplate.subject, body: otpTemplate.body.replace('{{code}}', otp) })
}
