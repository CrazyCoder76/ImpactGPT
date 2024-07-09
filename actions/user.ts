'use server'

import { ResultCode, getStringFromBuffer, removeUndefined } from '@/lib/utils'
import dbConnect from '@/lib/db/mongoose'
import UserModel from '@/models/User'
import { User } from '@/lib/types'
// import { findGroupById } from './group';

export async function getUserByEmail(email: string) {
  try {
    await dbConnect()
    const user = await UserModel.findOne({ email: email })
    return user
  } catch (err: any) {
    console.log(err)
    return null
  }
}

export async function getUserByEmailLean(email: string) {
  try {
    await dbConnect()
    const user = await UserModel.findOne({ email: email }).lean()
    return user
  } catch (err: any) {
    return null
  }
}

export async function getGroupUsers(groupId: string) {
  try {
    await dbConnect()
    const users = await UserModel.find({ groupId: groupId })
    return users.map((user: User) => {
      return { id: user._id, email: user.email, status: user.status }
    })
  } catch (err: any) {
    return []
  }
}

export async function createUser(
  title: string | undefined,
  firstName: string | undefined,
  lastName: string | undefined,
  username: string,
  email: string,
  gender: string | undefined,
  birthday: Date | undefined,
  company: string | undefined,
  department: string | undefined,
  position: string | undefined,
  rank: Number | undefined,
  location: string | undefined,
  team: string | undefined,
  employeeId: string | undefined,
  bio: string | undefined,
  phoneNumber: string | undefined,
  mobileNumber: string | undefined,
  lineId: string | undefined,
  groupId: string | undefined,
  hashedPassword: string,
  salt: string,
  expireDate: Date | undefined,
  creditLimit: Number | undefined
) {
  try {
    await dbConnect()
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return {
        type: 'error',
        resultCode: ResultCode.UserAlreadyExists
      }
    } else {
      const new_user = new UserModel({
        title,
        firstName,
        lastName,
        name: username,
        email,
        gender,
        dateOfBirth: birthday,
        company,
        department,
        position,
        rank,
        location,
        team,
        employeeId,
        bio,
        phoneNumber,
        mobileNumber,
        lineId,
        groupId: groupId,
        password: hashedPassword,
        role: 1,
        salt,
        status: 'created',
        expireDate,
        creditLimit,
        creditUsage: 0
      })

      await new_user.save()
      const newUserId = new_user._id.toString()
      return {
        type: 'success',
        resultCode: ResultCode.UserCreated,
        id: newUserId
      }
    }
  } catch (err: any) {
    console.log(JSON.stringify(err))
    return {
      type: 'error',
      resultCode: ResultCode.UnknownError
    }
  }
}

export async function getAllUsers() {
  try {
    await dbConnect()
    const users = await UserModel.find({}, { password: 0, salt: 0 })
    const serialized_users: User[] = users.map((user: User, index: number) => {
      // const group = await findGroupById(user.groupId)
      return {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        title: user.title,
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        company: user.company,
        department: user.department,
        position: user.position,
        team: user.team,
        rank: user.rank,
        location: user.location,
        employeeId: user.employeeId,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
        mobileNumber: user.mobileNumber,
        lineId: user.lineId,
        groupId: user.groupId,
        status: user.status,
        expireDate: user.expireDate,
        creditLimit: user.creditLimit,
        creditUsage: user.creditUsage
      }
    })
    return serialized_users
  } catch (err: any) {
    return []
  }
}

export async function updateUser(
  id: string,
  payload: {
    title?: string
    firstName?: string
    lastName?: string
    name?: string
    email?: string
    gender?: string
    dateOfBirth?: Date
    company?: string
    department?: string
    position?: string
    rank?: Number
    location?: string
    team?: string
    employeeId?: string
    bio?: string
    phoneNumber?: string
    mobileNumber?: string
    lineId?: string
    groupId?: string
    password?: string
    salt?: string
    status?: string
    expireDate?: Date
    creditLimit?: Number
  }
) {
  try {
    await dbConnect()
    const cleanPayload = removeUndefined(payload)

    if (cleanPayload.password) {
      const encoder = new TextEncoder()
      const salt = crypto.randomUUID()
      const saltedPassword = encoder.encode(cleanPayload.password + salt)
      const hashedPasswordBuffer = await crypto.subtle.digest('SHA-256', saltedPassword)
      const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

      cleanPayload.password = hashedPassword
      cleanPayload.salt = salt
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: cleanPayload })

    if (!updatedUser) {
      throw new Error('User not found')
    }

    return {
      success: true,
      user: updatedUser
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.toString()
    }
  }
}

export async function getUserById(id: string) {
  try {
    await dbConnect()
    const user = await UserModel.findById(id)

    if (!user) {
      throw new Error('User not found')
    }

    const { password, ...userWithoutPassword } = user.toObject()

    return userWithoutPassword
  } catch (err: any) {
    return null
  }
}

export async function deleteUserById(id: string) {
  try {
    await dbConnect()
    await UserModel.findOneAndDelete({ _id: id })
    return {
      success: true
    }
  } catch (err: any) {
    return {
      success: false,
      messsage: err.toString()
    }
  }
}
