import { auth } from '@/auth'
import { getChatList, getMissingKeys } from '@/app/(chat)/actions'
import { Chat } from '@/components/chat/chat'
import { AI } from '@/lib/chat/actions'
import { nanoid } from '@/lib/utils'
import { Session, User } from '@/lib/types'
import { notFound, redirect } from 'next/navigation'
import { getUserById } from '@/actions/user'

export const metadata = {
  title: 'Next.js AI Chatbot'
}


export default async function IndexPage() {

  const id = nanoid()
  const session = (await auth()) as Session;
  const missingKeys = await getMissingKeys();

  return (
    <AI initialAIState={{ chatId: id, modelId: 'default', messages: [], agentId: 'default' }}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}

