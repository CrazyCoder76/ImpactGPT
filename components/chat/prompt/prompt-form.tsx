'use client'

import { useEffect, useState, useRef } from 'react';
import Textarea from 'react-textarea-autosize'
import { PromptLibrary } from '@/components/chat/prompt/prompt-library'
import type { AI } from '@/lib/chat/actions'
import { useRouter } from 'next/navigation'
import { nanoid } from 'nanoid'
import { AnimatePresence, color, motion } from 'framer-motion'

import { useUIState, useAIState } from 'ai/rsc'

import { BotMessage, ErrorMessage, UserMessage } from '@/components/details/message'
import { Button } from '@/components/ui/button'
import { IconBook, IconMicrophone, IconPaperClip, IconPen } from '@/components/ui/icons'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'

import { streamingFetch } from '@/lib/utils';
import { saveChat } from '@/app/(chat)/actions'
// import { getPrompts } from '@/app/admin/prompts/actions'
import { Agent, GPTModel, Prompt, Session } from '@/lib/types'

import useStore from '@/lib/store';
import { usePromptPanelStore } from '@/lib/store'
import { getAgentIconUrl } from '@/app/admin/agents/actions'
import { evaluateUsage } from '@/components/chat/prompt/evaluate-usage';
import { IconGPT, IconGPT4, IconGemini, IconHaiku } from '@/components/ui/icons';

export const getMessageIcon = (agentIconUrl: string, model?: GPTModel) => {
  let icon;
  if (agentIconUrl.length > 0) {
    icon = <img src={agentIconUrl} alt="" className='rounded-md' />
  }
  else {
    // console.log('second');
    if (!model) return;
    switch (model.modelId) {
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
        icon = <img src={model?.iconUrl || ''} alt='icon' />
    }
  }
  return icon;
}
export function PromptForm({ session, id }: { session: Session, id: string }) {
  const router = useRouter()
  const [pending, setPending] = useState<boolean>(false);
  const { formRef, onKeyDown } = useEnterSubmit({ pending });
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [messages, setMessages] = useUIState<typeof AI>();
  const [aiState, setAIState] = useAIState<typeof AI>();
  const [isEnterToSend, setIsEnterToSend] = useState<boolean>(true);
  const [promptLibraryOpen, setPromptLibraryOpen] = useState(false);
  const [outputControlOpen, setOutputControlOpen] = useState(false);

  const { selectedAgent, currentModel, setNewChatId, input, setInput } = useStore();
  const { setOnUsePromptHandler } = usePromptPanelStore();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])


  const handleSubmit = async (e: any) => {
    e.preventDefault()
    // setPending(true);

    if (window.innerWidth < 600) {
      e.target['message']?.blur()
    }

    const value = input.trim()
    setInput('')
    if (!value) return

    setMessages((currentMessages: any[]) => ([
      ...currentMessages,
      {
        id: nanoid(),
        display: <UserMessage>{value}</UserMessage>,
        date: new Date()
      }
    ]));

    let messages = aiState.messages.map((message: any) => ({
      role: message.role,
      content: message.content,
      date: message.date
    }));

    messages = [...messages, { role: 'user', content: value, date: new Date() }];

    const payload = {
      messages: messages,
      modelId: currentModel?.modelId || '',
      agentId: !selectedAgent ? '' : selectedAgent.id,
      userId: session.user.id
    }
    let streamIterator;
    const limited = await evaluateUsage(payload);
    if (!limited) {
      try {
        streamIterator = streamingFetch('/api/response',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        let content = '';

        let agentIconUrl = '';
        if (selectedAgent) agentIconUrl = await getAgentIconUrl(selectedAgent.id);

        setMessages((currentMessages: any[]) => ([
          ...currentMessages,
          {
            id: nanoid(),
            display: <BotMessage content={content} icon={getMessageIcon(agentIconUrl, currentModel)} />,
            date: new Date()
          }
        ]));

        for await (const chunk of streamIterator) {
          content += chunk;
          setMessages((currentMessages: any[]) => [
            ...(currentMessages.slice(0, -1)),
            {
              id: nanoid(),
              display: <BotMessage content={content} icon={getMessageIcon(agentIconUrl, currentModel)} />,
              date: new Date()
            }
          ]);
        }

        const updated_state: any = {
          ...aiState,
          chatId: id,
          modelId: currentModel?.modelId || '',
          agentId: selectedAgent?.id,
          messages: [...aiState.messages,
          {
            id: nanoid(), role: 'user', content: value, date: new Date()
          },
          {
            id: nanoid(), role: 'assistant', content: content, date: new Date()
          }]
        }
        await saveChat(updated_state);
        setNewChatId(id);
        setAIState(updated_state);
        setPending(false);
      }
      catch (error: any) {
        console.error('Streaming error:', error.message);
      }
    }
    else {
      setMessages((currentMessages: any[]) => ([
        ...currentMessages,
        {
          id: nanoid(),
          display: <ErrorMessage>Usage limit has been exceeded. Please wait an hour or use a different model.</ErrorMessage>,
          date: new Date()
        }
      ]));
      setPending(false);
    }
  }

  const onUsePromptHandler = (prompt: Prompt) => {
    setPromptLibraryOpen(false);
    setInput(prompt.prompt);
  }

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 max-h-32 overflow-auto'>
        {selectedAgent && messages.length == 0 && selectedAgent.starters && selectedAgent.starters.map((starter: string, index: number) => (
          <div key={index} className='flex opacity-100 translate-y-0'>
            <div className='group w-full border border-1 border-gray-200 dark:border-zinc-700 rounded-md bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-500 transition-colors line-clamp-2 py-2 px-3 text-sm text-left text-gray-800 dark:text-zinc-100 flex items-center justify-between gap-2 cursor-pointer'>
              <div className='flex items-center justify-center gap-2'>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" aria-hidden="true" className="w-4 h-4 flex-shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"></path>
                </svg>
                <span className="line-clamp-2">{starter}</span>
              </div>
              <Button className='border border-gray-300 dark:border-zinc-500 dark:hover:bg-zinc-500 dark:bg-zinc-600 dark:active:bg-zinc-700 rounded p-2 hover:bg-gray-300 active:bg-gray-400 transition-all'
                onClick={() => { setInput(starter); }}
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z" fill="black" stroke="black"></path>
                </svg>
              </Button>
            </div>
          </div>
        ))}
      </div >
      { outputControlOpen &&
        <div>
          
        </div>
      }
      <form
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <div className='flex items-end justify-center space-x-2 mb-2'>
          <div className='w-full space-y-2 pt-2'>
            <div className='w-full flex items-center justify-center gap-x-0 gap-y-2 flex-wrap sm:flex-nowrap'>
              {input.length === 0 && <div className='opacity-100 translate-x-0 max-w-[70px]'>
                <div className='flex items-center justify-center gap-0 pr-1'>
                  <Button variant='ghost' className='shrink-0 h-auto transition-colors rounded-md relative flex items-center justify-center p-1 text-gray-500 hover:text-orange-400'
                    onClick={async () => {
                      setOnUsePromptHandler(onUsePromptHandler)
                      setPromptLibraryOpen(true);
                    }}>
                    <IconBook />
                  </Button>
                  <Button variant='ghost' className={`shrink-0 h-auto transition-colors py-1 px-1 rounded-md relative text-gray-500 hover:text-gray-900 dark:hover:text-zinc-200 ${outputControlOpen && "text-white bg-gray-500"}`}
                    onClick={() => {
                      setOutputControlOpen(prev => !prev);
                    }}
                    >
                    <IconPen />
                  </Button>
                </div>
              </div>}

              <div className='w-full'>
                <div>
                  {input.length > 0 && (
                    <div className='flex items-center justify-between gap-1 flex-wrap my-2 opacity-100 translate-y-0 max-h-[50px]'>
                      <label htmlFor="enter-to-send" className='flex items-center justify-start gap-2 text-sm'>
                        <input id='enter-to-send' type="checkbox" checked={isEnterToSend} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsEnterToSend(e.target.checked)} />
                        <span>Send message on Enter key</span>
                      </label>
                    </div>)}
                  <div className='relative w-full'>
                    <Textarea
                      placeholder='Press "/" to focus input'
                      value={input}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      onFocus={(e: React.ChangeEvent<HTMLTextAreaElement>) => e.currentTarget.placeholder = 'Type "/" for menu, "@" to mention an AI agent'}
                      onBlur={(e: React.ChangeEvent<HTMLTextAreaElement>) => e.currentTarget.placeholder = 'Press "/" to focus input'}
                      className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 min-h-[36px] resize-none dark:bg-gray-900 dark:text-white dark:focus:ring-blue-900 pl-12 md:pl-[60px] max-h-[40px] sm:text-sm sm:leading-6 outline-none'
                    />
                    <Button variant='default' className='absolute h-auto min-h-[30px] md:min-h-0 min-w-[30px] bottom-1/2 left-1.5 translate-y-1/2 flex items-center space-x-1 space-x-reverse text-xs py-1 rounded border border-gray-300 dark:border-gray-700 dark:text-white text-black px-2 hover:border-blue-600 hover:dark:border-blue-500'>
                      <span className='hidden md:block'>^K</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className={cn('relative flex items-center justify-center gap-2 pl-1',
                { 'flex-wrap sm:flex-nowrap w-full sm:w-auto self-end': input.length > 0 }
              )}>
                {/* <div className={cn('flex items-center justify-center gap-0 sm:static', { 'absolute right-0 top-0 sm:static': input.length > 0 })}>
                  <Button variant='ghost' type='button' className='shrink-0 h-auto transition-colors rounded-md relative flex items-center justify-center py-1 px-1  text-gray-500 hover:text-orange-400'>
                    <IconPaperClip />
                  </Button>
                  <Button variant='ghost' type="button" className='shrink-0 h-auto transition-colors rounded-md relative flex items-center justify-center py-1 px-1  text-gray-500 hover:text-orange-400'>
                    <IconMicrophone />
                  </Button>
                </div> */}
                <AnimatePresence mode='wait'>
                  {input.length > 0 && <motion.div
                    initial={{ x: 10 }}
                    animate={{ x: 0 }}
                    exit={{ x: -10, opacity: 0 }}
                    className='opacity-100 translate-x-0 max-w-[320px] max-h-[70px] sm:max-h-none'
                  >
                    <Button variant='default' className='inline-flex items-center px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap space-x-1' disabled={pending}>
                      Send
                    </Button>
                  </motion.div>}
                </AnimatePresence>
              </div>
            </div>
            <div className='w-full flex flex-wrap justify-center items-center pt-2'>
              <span className='text-xs text-muted-foreground'>ImpactGPT can make mistakes. Check important info.</span>
              <span className='ml-2 text-xs text-muted-foreground'>Impact Chat 2.0.1</span>
            </div>
          </div>
        </div>
      </form>
      <PromptLibrary session={session} open={promptLibraryOpen} onOpenChange={setPromptLibraryOpen} />
    </>
  )
}
