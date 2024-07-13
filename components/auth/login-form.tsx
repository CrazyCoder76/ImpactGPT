'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { redirect, useRouter, useSearchParams } from 'next/navigation'

import { getMessageFromCode } from '@/lib/utils'
import { getOneTimePasscode } from '@/actions/auth'
import { authenticate, checkAdminExists } from '@/app/auth/login/actions'
import { IconSpinner } from '../ui/icons'
import { useSession } from 'next-auth/react'

enum Stage { EmailInput, OtpInput }

export default function LoginForm({ userId }: { userId?: string }) {
  const router = useRouter()
  const [loginDisabled, setLoginDisabled] = React.useState<boolean>(false)
  const [requestOtpPending, setRequestOtpPending] = React.useState<boolean>(false)
  const [result, dispatch] = useFormState(authenticate, undefined)
  const [stage, setStage] = useState<Stage>(Stage.EmailInput)
  const [email, setEmail] = useState("");
  const search = useSearchParams()
  const callbackUrl = search.get("callbackUrl") || '/';

  useEffect(() => {
    if (userId) {
      redirect(callbackUrl);
    }
  }, [userId])

  useEffect(() => {
    const checkFunc = async () => {
      await checkAdminExists();
    }

    checkFunc();
  }, []);

  useEffect(() => {
    if (result) {
      if (result.type === 'error') {
        toast.error("Invalid or expired code", {
          duration: 2000
        })
      } else {
        toast.success(getMessageFromCode(result.resultCode), {
          duration: 2000
        })
        setLoginDisabled(true);
        router.push('/');
        router.refresh()
      }
    }
  }, [result, router])

  const onRequestOTP = useCallback(() => {
    if (!email)
      return
    if (stage !== Stage.EmailInput)
      return

    setRequestOtpPending(true);
    getOneTimePasscode(email).then(res => {
      if (!res.startsWith('Code'))
        toast.error(res);
      else {
        toast.success(res);
        setStage(Stage.OtpInput);
      }
      setRequestOtpPending(false);
    })
  }, [email, stage])

  return (
    <>
      <form
        action={dispatch}
      >
        <div className="w-full"><div className={stage !== Stage.EmailInput ? "hidden" : ""}>
          <label
            className="mb-2 mt-5 block text-xs font-medium text-zinc-400"
            htmlFor="email"
          >
            Enter your email:
          </label>
          <div className="relative">
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
              id="email" type="email" name="email"
              placeholder="Enter your email address"
              required
            />
          </div>
          <RequestOTPButton pending={requestOtpPending} onClick={onRequestOTP} />
        </div>

          <div className={`mt-4 ${stage !== Stage.OtpInput ? "hidden" : ""}`}>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
              htmlFor="password"
            >
              Enter the code in your email ({email}):
            </label>
            <div className="relative">
              <input
                className="peer block text-center w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="password"
                name="password"
                placeholder="XXXXXX"
                required
                minLength={6}
              />
            </div>
            <div className="flex gap-4">
              <LoginButton disabled={loginDisabled} />
              <button
                className='my-4 flex h-10 w-full flex-row items-center justify-center rounded-md p-2 text-sm font-semibold cursor-pointer border-2'
                onClick={() => setStage(Stage.EmailInput)}
              >Cancel</button>
            </div>
          </div>
        </div>
        {/* <Link
          href="/signup"
          className="flex flex-row gap-1 text-sm text-zinc-400"
        >
          No account yet? <div className="font-semibold underline">Sign up</div>
        </Link> */}
      </form>
    </>
  )
}

function RequestOTPButton({ pending, onClick }: { pending: boolean, onClick: Function }) {
  return (
    <button
      className={`my-4 flex h-10 w-full flex-row items-center gap-2 justify-center rounded-md p-2 text-sm font-semibold cursor-pointer ${pending
        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
        : 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
        }`}
      onClick={() => onClick()}
      aria-disabled={pending}
    >
      {pending && <IconSpinner />}
      Log in With Email
    </button>
  )
}

function LoginButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      className={`my-4 flex h-10 w-full flex-row items-center gap-2 justify-center rounded-md p-2 text-sm font-semibold cursor-pointer ${disabled
        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
        : 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
        }`}
      aria-disabled={pending}
      type="submit"
    >
      {pending && <IconSpinner />}
      Submit
    </button>
  )
}
