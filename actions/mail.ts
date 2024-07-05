'use server'
import connectToDatabase from '@/lib/db/mongoose'
import EmailSettingModel from '@/models/EmailSetting'
import nodemailer from 'nodemailer'
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
    // @ts-ignore
    const transport = nodemailer.createTransport(config)
    const msg = { from, to, subject, text: body, replyTo: reply_to }
    await transport.sendMail(msg)
    return 'success'
  } catch (e) {
    console.error(e)
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
  to,
  reply_to,
  subject,
  body
}: {
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
    from: smtpSettings.sender_email,
    to,
    reply_to,
    subject,
    body
  })

  return res
}

export const sendOTPEmail = async (to: string, otp: string) => {
  try {
    await connectToDatabase()
    let otpTemplate = await EmailSettingModel.findOne({ name: 'Login Email Template' })
    if (!otpTemplate)
      otpTemplate = {
        subject: 'Login to ImpactGPT',
        body: 'OTP Code: {{code}}'
      }
    return await sendEasyEmail({ to, subject: otpTemplate.subject, body: otpTemplate.body.replace('{{code}}', otp) })
  } catch (e) {
    return 'Internal Server Error'
  }
}

export const sentInviteEmail = async ({to}: {to: string}) => {
  try {
    await connectToDatabase()
    let invitationTemplate = await EmailSettingModel.findOne({ name: 'Invitation Email Template' })
    if (!invitationTemplate)
      invitationTemplate = {
        subject: 'You have been invited to Impact Chat',
        body: 'Please join us on http://13.250.239.12:3000/'
      }
    return await sendEasyEmail({ to, subject: invitationTemplate.subject, body: invitationTemplate.body })
  } catch (e) {
    return 'Internal Server Error'
  }
}