import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc';

import { auth } from '@/auth';
// import { saveChat } from '@/app/(chat)/actions';

import {
  // spinner,
  BotCard,
  BotMessage,
  // SystemMessage,
} from '@/components/details'

import { nanoid } from '@/lib/utils'
import { UserMessage } from '@/components/details/message'
import { Message } from '@/lib/types'

import { getAgentIconUrl } from '@/app/admin/agents/actions';
import { IconGPT, IconGPT4, IconGemini, IconHaiku } from '@/components/ui/icons';
import { getModelIconUrlByModelId } from '@/app/admin/models/action';

export type AIState = {
  chatId: string,
  agentId: string,
  modelId: string,
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode,
  date: string
}[]

export const AI = createAI<AIState, UIState>({
  actions: {},
  initialUIState: [],
  initialAIState: { chatId: '', modelId: '', agentId: 'default', messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()
      if (aiState) {
        const uiState = await getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
})

const getUIStateFromAIState = async (aiState: any) => {
  if (!aiState?.messages) return [];
  const agentId = aiState.agentId;
  let agentIconUrl = '';
  if (agentId != 'default') agentIconUrl = await getAgentIconUrl(agentId);
  const modelIconUrl = await getModelIconUrlByModelId(aiState.modelId);
  return aiState.messages
    .filter((message: any) => (message.role !== 'system'))
    .map((message: any, index: number) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} icon={getMessageIcon(agentIconUrl, aiState.modelId, modelIconUrl)} />
        ) : null,
      date: message.date
    }))
}


const getMessageIcon = (agentIconUrl: string, modelId: string, modelIconUrl: string) => {
  let icon;
  if (agentIconUrl.length > 0) {
    icon = <img src={agentIconUrl} alt="" className='rounded-md' />
  }
  else {
    // console.log('second');
    switch (modelId) {
      case 'gpt-4-turbo':
        icon = <IconGPT4 />
        break;
      case 'gpt-3.5-turbo':
        icon = <IconGPT />
        break;
      case 'models/gemini-pro':
        icon = <IconGemini />
        break;
      case 'claude-3-haiku-20240307':
        icon = <IconHaiku />
        break;
      default:
        icon = <img src={modelIconUrl} alt='' />
    }
  }
  return icon;
}

