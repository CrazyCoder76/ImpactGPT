import { Separator } from '@/components/ui/separator'
import { UIState } from '@/lib/chat/actions'
import { Session } from '@/lib/types'
import useStore from '@/lib/store'
import { format } from 'date-fns'

export interface ChatList {
  messages: UIState
  session?: Session
  isShared: boolean
}

export function ChatList({ messages, session, isShared }: ChatList) {
  const { selectedAgent } = useStore();
  if (!messages?.length) {
    return null
  }

  const formatDate = (date: Date) => format(date, 'dd MMM yyyy')

  let lastDate: string | null = null;

  return (
    <div className="relative mx-auto max-w-2xl px-4 pb-[200px] ">
      {selectedAgent && <div className='py-4 relative'>
        <div className='flex items-center justify-center'>
          <div className='flex flex-col items-center justify-center space-x-2'>
            <img src={selectedAgent?.pictureUrl} alt="TypingMind" className='rounded-lg' style={{ width: '120px' }} />
            <div className='font-semibold text-md text-emerald-400 dark:text-white pt-5 pb-3'>
              {selectedAgent?.title}
            </div>
            <div className='text-xs text-gray-500 dark:text-gray-400 whitespace-pre-line mt-2'>
              {selectedAgent?.description}
            </div>
          </div>
        </div>
      </div>}
      {messages.map((message, index) => {
        const messageDate = new Date(message.date);
        const formattedDate = formatDate(messageDate);
        const showDateSeparator = lastDate !== formattedDate;
        lastDate = formattedDate;

        return (
          <div key={message.id}>
            {showDateSeparator && (
              <>
                <div className="flex items-center my-4">
                  <div className="grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-500 text-xs">{formattedDate}</span>
                  <div className="grow border-t border-gray-300"></div>
                </div>
              </>
            )}
            <div className="message">{message.display}</div>
          </div>
        )
      })}
    </div>
  )
}
