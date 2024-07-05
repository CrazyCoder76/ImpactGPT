'use server'

import dbConnect from '@/lib/db/mongoose'
import User from '@/models/User'
import { sendOTPEmail } from './mail'

function getRandomCode() {
  return new Array(6)
    .fill(0)
    .map(_ => String(Math.floor(Math.random() * 10)))
    .join('')
}

export async function getOneTimePasscode(email: string) {
  try {
    await dbConnect()
    const user = await User.findOne({ email: email })

    if (user) {
      const otp_lifetime = Number(process.env.OTP_LIFETIME || 5)
      user.otp = getRandomCode()
      user.otpExpireAt = new Date(Number(new Date()) + 1000 * 60 * otp_lifetime)
      await user.save()

      // TODO: These code are skipped just for testing purpose
      const res = await sendOTPEmail(email, user.otp)
      if (res != 'success') throw 'Email was not sent'

      return `Code sent to ${email}`
    } else {
      return 'No such user'
    }
  } catch (err: any) {
    return err
  }
}
