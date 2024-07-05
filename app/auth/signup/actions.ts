'use server'

import { signIn } from '@/auth'
import { ResultCode, getStringFromBuffer } from '@/lib/utils'
import { z } from 'zod'
// import { getUser } from '../login/actions'
import { createUser } from '@/actions/user'
import { AuthError } from 'next-auth'


interface Result {
  type: string
  resultCode: ResultCode
}

export async function signup(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  // const username = formData.get('username') as string
  // const email = formData.get('email') as string
  // const password = formData.get('password') as string

  // const parsedCredentials = z
  //   .object({
  //     email: z.string().email(),
  //     password: z.string().min(6)
  //   })
  //   .safeParse({
  //     email,
  //     password
  //   })

  // if (parsedCredentials.success) {

  //   const salt = crypto.randomUUID()

  //   const encoder = new TextEncoder()
  //   const saltedPassword = encoder.encode(password + salt)
  //   const hashedPasswordBuffer = await crypto.subtle.digest(
  //     'SHA-256',
  //     saltedPassword
  //   )
  //   const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

  //   try {
  //     const result = await createUser(username, email, '', hashedPassword, salt);

  //     if (result.resultCode === ResultCode.UserCreated) {
  //       await signIn('credentials', {
  //         email,
  //         password,
  //         redirect: false
  //       })
  //     }
  //     return result;
  //   } catch (error) {
  //     if (error instanceof AuthError) {
  //       switch (error.type) {
  //         case 'CredentialsSignin':
  //           return {
  //             type: 'error',
  //             resultCode: ResultCode.InvalidCredentials
  //           }
  //         default:
  //           return {
  //             type: 'error',
  //             resultCode: ResultCode.UnknownError
  //           }
  //       }
  //     } else {
  //       return {
  //         type: 'error',
  //         resultCode: ResultCode.UnknownError
  //       }
  //     }
  //   }
  // } else {
  //   return {
  //     type: 'error',
  //     resultCode: ResultCode.InvalidCredentials
  //   }
  // }
  return new Promise(e => e)
}
