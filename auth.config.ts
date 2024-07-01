import type { NextAuthConfig } from 'next-auth'
// import { signIn } from 'next-auth/react'
// import { NextResponse } from 'next/server'
// import { getUserById } from './actions/user'

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    // signIn: '/auth/login',
    // newUser: '/signup'
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {

      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith('/auth/login');

      if (isLoggedIn) {
        if (isOnLoginPage) {
          // return NextResponse.redirect(new URL('/', nextUrl));
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, id: user.id }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        const { id } = token as { id: string }
        const { user } = session;
        session = { ...session, user: { ...user, id } }
      }

      return session
    },
    // async signIn({ user, account, profile, email, credentials }) {
    //   // Redirect to the home page after login
    //   // return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL));
    //   return true;
    // }
  },
  providers: [],
  trustHost: true, // This line trusts all hosts, not recommended for production
} satisfies NextAuthConfig
