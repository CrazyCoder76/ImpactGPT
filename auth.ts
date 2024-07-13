import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { z } from 'zod'
import { authConfig } from './auth.config'

// import { getUser } from './app/auth/login/actions'

import { getUserByEmail, getUserByEmailLean } from './actions/user'
import { NextResponse } from 'next/server'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    // @ts-ignore
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const email = user.email
        const userDoc = await getUserByEmailLean(email!)
        console.log({ userDoc })
        if (userDoc) {
          return true
        }
        return false
      }
      return true
    }
  },
  trustHost: true, // This line trusts all hosts, not recommended for production
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
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ]
})
