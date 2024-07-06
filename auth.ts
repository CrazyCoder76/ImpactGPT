import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { z } from 'zod'
import { getStringFromBuffer } from './lib/utils'
// import { getUser } from './app/auth/login/actions'

import { getUserByEmail } from './actions/user'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      // @ts-ignore
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6)
          })
          .safeParse(credentials)
        if (parsedCredentials.success) {
          const { email, password: otp } = parsedCredentials.data
          const user = await getUserByEmail(email)
          if (!user) return null

          // TODO: should remove super-otp
          if ((otp === user.otp || otp === '123456') && !!user.otpExpireAt && user.otpExpireAt > new Date()) {
            if (user.status === 'disabled') {
              throw new Error('User is disabled')
            }
            return user
          } else {
            return null
          }
        }

        return null
      }
    })
  ]
})
