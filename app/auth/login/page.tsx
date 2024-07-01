'use client'

import { useEffect } from 'react'
import LoginForm from '@/components/auth/login-form'
import { checkAdminExists } from '@/app/auth/login/actions';
// import { auth } from '@/auth'
// import { Session } from '@/lib/types'
// import { redirect } from 'next/navigation'

export default function LoginPage() {
  useEffect(() => {
    const checkFunc = async () => {
      await checkAdminExists();
    }

    checkFunc();
  }, []);

  return (
    <main className="flex flex-col p-4 h-screen justify-center">
      <LoginForm />
    </main>
  )
}
