'use client'

// import { useRef } from 'react'
import { cn } from '@/lib/utils'
import { getChat } from '@/app/(chat)/actions'
import { getAgent } from '@/app/admin/agents/actions'
import { ChatList } from '@/components/chat/chat-list'
import { ChatPanel } from '@/components/chat/chat-panel'
import { AgentPanel } from '@/components/chat/agent/agent-panel'
import { useEffect, useState } from 'react'
import { useUIState, useAIState } from 'ai/rsc'
import { Message, Session } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import useStore from '@/lib/store'
import { getModelByModelId } from '@/app/admin/models/action'

// import { nanoid } from 'nanoid'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id: string
  session: Session,
  missingKeys: string[],
}

export function Chat({ id, className, session, missingKeys }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [messages] = useUIState()
  const [aiState] = useAIState()
  const { newChatId, setSelectedAgent, setInput, setCurrentModel, setSelectedChatId } = useStore();

  useEffect(() => {
    // setCurrentModel(aiState.modelName);
    setSelectedChatId(id);
    const fetchChat = async () => {
      const chat = await getChat(id);
      const res = await getModelByModelId(aiState.modelId);
      if (res.status == 'success') {
        if (res.model) setCurrentModel(res.model);
      }
      if (chat?.agentId && chat.agentId !== 'default') {
        const agent = (await getAgent(chat.agentId)) || undefined;
        setSelectedAgent(agent);
      } else {
        setSelectedAgent(undefined);
        setInput('');
      }
    };

    fetchChat();
  }, [id, aiState.modelId, setCurrentModel, setSelectedChatId, setSelectedAgent, setInput]);

  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && aiState.messages.length == 2) {
        router.push(`/chat/${newChatId}`);
        router.refresh();
      }
    }
  }, [aiState.messages, newChatId, path, router, session?.user]);


  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor()

  return (
    <div
      className="w-full overflow-auto pl-0"
      ref={scrollRef}
    >
      <div
        className={cn('pt-4 md:pt-10', className)}
        ref={messagesRef}
      >
        {messages.length ? (
          <ChatList messages={messages} isShared={false} session={session} />
        ) : (
          <AgentPanel />
        )}
        <div className="w-full h-px" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        session={session}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
    </div>
  )
}
