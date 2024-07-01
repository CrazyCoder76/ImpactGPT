import { CoreMessage } from 'ai'
import { extend } from 'dayjs'

export type Message = CoreMessage & {
  _id?: string,
  date: Date
}

export type Prompt = {
  _id: string,
  title: string,
  description?: string,
  prompt: string,
  ownerId?: string
}

export interface Chat extends Record<string, any> {
  id: string
  userId: string
  title: string,
  overview: string,
  // path?: string
  messages: Message[]
  createdAt?: Date,
  agentId: string,
  modelId: string,
  isShared: boolean,
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
    email: string,
    name: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface Agent {
  id: string;
  title: string;
  isPinned: boolean;
  description: string;
  pictureUrl: string;
  gptModel: string;
  instruction: string;
  welcomeMsg: string;
  starters?: string[];
  ispinned?: boolean; // Include all properties required by the Agent type
  assignedModel?: string; // Include all properties required by the Agent type
}

export interface GPTModel {
  id: string,
  name: string,
  description: string,
  iconUrl: string,
  weight?: number,
  isPinned?: boolean,
  isCustomModel?: boolean,
  modelId?: string,
  endpoint?: string,
  headers?: Map<string, string>
}

export interface Usage {
  userId: string,
  modelName: string,
  timestamp: Date,
  messageCount: number
}

export interface EmailSetting {
  name: string,
  subject: string,
  body: string
}

export interface User extends Record<string, any> {
  _id: string,
  name: string;
  email: string;
  role: Number;
  password?: string;
  salt?: string,
  groupId: string,
  invited?: string
}

export interface Group extends Record<string, any> {
  _id?: string,
  name: string;
  description: string;
}

export interface ApiKey extends Record<string, any> {
  _id?: string,
  name: string,
  key: string,
  placeholder: string
}

