// models/user-model.ts

import mongoose from 'mongoose'
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

import { User } from '@/lib/types'

// export interface MongoUser extends User, mongoose.Document {}

export type TUser = User & {
  createdAt: string
  updatedAt: string
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    required: true
  },
  groupId: {
    type: String
  },
  gender: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  company: {
    type: String
  },
  department: {
    type: String
  },
  position: {
    type: String
  },
  rank: {
    type: Number
  },
  location: {
    type: String
  },
  team: {
    type: String
  },
  employeeId: {
    type: String
  },
  bio: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  mobileNumber: {
    type: String
  },
  lineId: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String
  },
  salt: {
    type: String
  },
  otp: {
    type: String
  },
  otpExpireAt: {
    type: Date
  },
  expireDate: {
    type: Date
  },
  creditLimit: {
    type: Number
  },
  creditUsage: {
    type: Number
  }
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
