
import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { auth } from '@/auth'
import { getChat, getMissingKeys } from '@/app/(chat)/actions'
import { Chat } from '@/components/chat/chat'
import { AI } from '@/lib/chat/actions'
import { Session } from '@/lib/types'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  if (!session?.user.id) {
    redirect(`/login?next=/chat/${params.id}`)
  }
  let chat = await getChat(params.id);
  {/* @ts-ignore */ }
  if (chat == null && chat?.userId !== session?.user?.id) {
    // redirect('/');
    redirect('/');
  }
  const agentId = chat.agentId;
  return (
    <AI initialAIState={{ chatId: params.id, modelId: chat.modelId, messages: chat.messages, agentId: agentId }}>
      <Chat
        id={params.id}
        session={session}
        initialMessages={[]}
        missingKeys={missingKeys}
      />
    </AI>
  )
}
