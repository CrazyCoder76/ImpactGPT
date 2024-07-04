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
  invited: {
    type: Boolean
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String
  },
  otp: String,
  otpExpireAt: Date
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
