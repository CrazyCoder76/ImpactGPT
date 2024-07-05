import { CoreMessage } from 'ai'
import { extend } from 'dayjs'

export type Message = CoreMessage & {
  _id?: string
  date: Date
}

export type Prompt = {
  _id: string
  title: string
  description?: string
  prompt: string
  ownerId?: string
}

export interface Chat extends Record<string, any> {
  id: string
  userId: string
  title: string
  overview: string
  // path?: string
  messages: Message[]
  createdAt?: Date
  agentId: string
  modelId: string
  isShared: boolean
  // sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
    name: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface Agent {
  id: string
  title: string
  isPinned: boolean
  description: string
  pictureUrl: string
  gptModel: string
  instruction: string
  welcomeMsg: string
  starters?: string[]
  ispinned?: boolean // Include all properties required by the Agent type
  assignedModel?: string // Include all properties required by the Agent type
}

export interface GPTModel {
  id?: string,
  name: string,
  description: string,
  iconUrl: string,
  weight?: number,
  isPinned?: boolean,
  contextSize?: number,
  isCustomModel?: boolean,
  modelId?: string,
  endpoint?: string,
  headers?: Map<string, string> | { [key: string]: string }
  modelType?: string
}

export interface Usage {
  userId: string
  modelName: string
  timestamp: Date
  messageCount: number
}

export interface EmailSetting {
  name: string
  subject: string
  body: string
}

export interface User extends Record<string, any> {
  _id: string
  name: string
  title: string
  firstName: string
  lastName: string
  email: string
  role: Number
  password?: string
  gender: string
  dateOfBirth: Date
  company: string
  department: string
  position: string
  team: string
  rank: Number
  location: string
  employeeId: string
  bio: string
  phoneNumber: string
  mobileNumber: string
  lineId: string
  salt?: string
  groupId: string
  status?: string
  expireDate?: Date
  creditLimit: Number
  creditUsage: Number
  otp?: string
  otpExpireAt?: Date
}

export interface Group extends Record<string, any> {
  _id?: string
  name: string
  description: string
  expireDate: Date
  creditLimit: Number
  status: string
}

export interface ApiKey extends Record<string, any> {
  _id?: string
  name: string
  key: string
  placeholder: string
}

export interface AppSetting {
  smtp_host: string
  smtp_port: number
  smtp_username: string
  smtp_password: string
  sender_email: string
  sender_name: string
  reply_email: string
}
