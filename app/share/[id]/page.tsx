"use client"

import { getChat, getSharedChat } from "@/app/(chat)/actions";
import { getAgentIconUrl } from "@/app/admin/agents/actions";
import { getModelByModelId } from "@/app/admin/models/action";
import { ChatList } from "@/components/chat/chat-list";
import { getMessageIcon } from "@/components/chat/prompt/prompt-form";
import { BotMessage, UserMessage } from "@/components/details/message";
import { AIState, UIState } from "@/lib/chat/actions";
import { Message } from "@/lib/types";
import { useEffect, useState } from "react";

interface SharePageProps {
  params: {
    id: string
  }
}

export default function SharePage({ params }: SharePageProps) {
  const [messages, setMessages] = useState<UIState>();
  useEffect(() => {
    (async () => {
      const chat = await getSharedChat(params.id);

      if (chat) {
        const data: UIState = await getUIStateFromAIState({
          chatId: chat.id,
          agentId: chat.agentId,
          modelId: chat.modelId,
          messages: chat.messages
        });

        if (data) setMessages(data);
        // console.log(messages);
      }
    })();
  }, [params.id]);

  return (
    <>
      <div className="flex-1 space-y-6">
        <div className="border-b bg-background px-4 py-6 md:px-6 md:py-8">
          <div className="mx-auto max-w-2xl">
            <div className="space-y-1 md:-mx-8">
              <h1 className="text-2xl font-bold">Shared Chat</h1>
              <div className="text-sm text-muted-foreground">
                {messages?.length} messages
              </div>
            </div>
          </div>
        </div>
        {
          messages && <ChatList messages={messages} isShared={true} />
        }
      </div>
    </>

  )
}


const getUIStateFromAIState = async (aiState: AIState) => {
  if (!aiState?.messages) return [];
  const agentId = aiState.agentId;
  let agentIconUrl = '';
  if (agentId != 'default') agentIconUrl = await getAgentIconUrl(agentId);
  const model = (await getModelByModelId(aiState.modelId)).model;
  return aiState.messages
    .filter((message: any) => (message.role !== 'system'))
    .map((message: any, index: number) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} icon={getMessageIcon(agentIconUrl, model)} />
        ) : <></>,
      date: message.date
    }))
}