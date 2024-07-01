import * as React from 'react'

// import { shareChat } from '@/app/(chat)/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/chat/prompt/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
// import { IconShare } from '@/components/ui/icons'
// import { ChatShareDialog } from '@/components/chat/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
// import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
// import { UserMessage } from '../details/message'
import { cn } from '@/lib/utils'
import { Session } from '@/lib/types'
// import { useSidebar } from '@/lib/hooks/use-sidebar'

export interface ChatPanelProps {
  id: string
  isAtBottom: boolean
  scrollToBottom: () => void
  session: Session
}

export function ChatPanel({
  id,
  isAtBottom,
  scrollToBottom,
  session
}: ChatPanelProps) {
  // const [aiState] = useAIState();
  // const [messages, setMessages] = useUIState<typeof AI>();
  // const { submitUserMessage } = useActions();

  // const exampleMessages: any[] = []
  // const [startersView, setStartersView] = React.useState(true);

  return (
    <div
      className={cn(
        'w-full fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[320px]',)}
    >
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {/* {messages.length === 0 &&
            exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${index > 1 && 'hidden md:block'
                  }`}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])


                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))} */}
        </div>

        <div className='mx-auto w-full hide-when-print transition-all max-w-3xl'>
          <div className='px-4 pb-4 pt-0 bg-white dark:bg-gray-950 transition-colors'>
            <div className='pb-safe'>
              <PromptForm id={id} session={session} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
