'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { authenticate } from '@/app/auth/login/actions'
// import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { IconSpinner } from '../ui/icons'
import { getMessageFromCode } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { sendEasyEmail as sendEmail } from '@/actions/mail'

export default function LoginForm() {
  const router = useRouter()
  const [disabled, setDisabled] = React.useState<boolean>(false)
  const [result, dispatch] = useFormState(authenticate, undefined)

  useEffect(() => {
    if (result) {
      if (result.type === 'error') {
        toast.error(getMessageFromCode(result.resultCode), {
          duration: 2000
        })
      } else {
        toast.success(getMessageFromCode(result.resultCode), {
          duration: 2000
        })
        setDisabled(true);
        router.push('/');
        router.refresh()
      }
    }
  }, [result, router])

  const onSendSMS = async () => {
    try {
      await sendEmail({ to: "allenbull1234@gmail.com", subject: "Test Sending", body: "This is test email using GMAIL sms provider" });
    }
    catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <form
        action={dispatch}
        className="flex flex-col items-center gap-4 space-y-3"
      >
        <div className="w-full flex-1 rounded-lg border bg-white px-6 pb-4 pt-8 shadow-md  md:w-96 dark:bg-zinc-950">
          <h1 className="mb-3 text-2xl font-bold">Please log in to continue.</h1>
          <div className="w-full">
            <div>
              <label
                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>
          <LoginButton disabled={disabled} />
        </div>

        {/* <Link
        href="/signup"
        className="flex flex-row gap-1 text-sm text-zinc-400"
      >
        No account yet? <div className="font-semibold underline">Sign up</div>
      </Link> */}

      </form>
      <button onClick={onSendSMS}>send sms</button>
    </>
  )
}

function LoginButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      className={`my-4 flex h-10 w-full flex-row items-center justify-center rounded-md p-2 text-sm font-semibold ${disabled
        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
        : 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
        }`}
      aria-disabled={pending}
    >
      {pending ? <IconSpinner /> : 'Log in'}
    </button>
  )
}
