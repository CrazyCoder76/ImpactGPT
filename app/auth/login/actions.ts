'use server'

import fs from 'fs';
import path from 'path';
import { z } from 'zod'
import { AuthError } from 'next-auth'
// import { auth, signIn } from '@/auth'
// import { User } from '@/lib/types'
// import { AuthError, Session } from 'next-auth'
import { signIn } from '@/auth'
import User from '@/models/User'
import { ResultCode } from '@/lib/utils'
import dbConnect from '@/lib/db/mongoose'

interface Result {
  type: string
  resultCode: ResultCode
}

export async function authenticate(_prevState: Result | undefined, formData: FormData): Promise<Result | undefined> {
  try {
    const email = formData.get('email')
    const password = formData.get('password')

    const parsedCredentials = z
      .object({
        email: z.string().email(),
        password: z.string().min(6)
      })
      .safeParse({
        email,
        password
      })

    if (parsedCredentials.success) {
      await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      return {
        type: 'success',
        resultCode: ResultCode.UserLoggedIn
      }
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials
      }
    }
  } catch (error: any) {

    if (error.type === "CallbackRouteError") {
      return {
        type: 'error',
        resultCode: ResultCode.UserDisabled
      }
    }
    
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            type: 'error',
            resultCode: ResultCode.InvalidCredentials
          }
        default:
          return {
            type: 'error',
            resultCode: ResultCode.UnknownError
          }
      }
    }
  }
}

export async function checkAdminExists() {
  try {
    await dbConnect();
    const collectionExists = await User.db.db.listCollections({ name: 'users' }).hasNext();
    if (!collectionExists) {
      const filePath = path.join(process.cwd(), 'db_json', 'users.json');
      const jsonData = fs.readFileSync(filePath, 'utf8');
      const users = JSON.parse(jsonData);
      await User.insertMany(users);
    }
    return {
      status: 200
    }
  } catch (err) {
    console.error(err);
    return {
      status: 500
    }
  }
}