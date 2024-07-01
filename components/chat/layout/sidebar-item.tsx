'use client'

import * as React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { motion } from 'framer-motion'

// import { buttonVariants } from '@/components/ui/button'
// import { IconMessage, IconUsers } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IconAnthropic, IconBot, IconDelete, IconGPT, IconGPT4, IconGemini, IconHaiku, IconMenu, IconRemove, IconShare } from '@/components/ui/icons'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { type Chat } from '@/lib/types'
import { cn } from '@/lib/utils'
import { getAgentIconUrl } from '@/app/admin/agents/actions';
import { getModelIconUrlByModelId } from '@/app/admin/models/action';

interface SidebarItemProps {
  index: number
  chat: Chat
  children: React.ReactNode
}

export function SidebarItem({ index, chat, children }: SidebarItemProps) {
  const pathname = usePathname()
  const router = useRouter();
  const [icon, setIcon] = React.useState<React.ReactNode>();
  const isActive = pathname.endsWith(chat.id);

  React.useEffect(() => {
    (async () => {
      let iconUrl = '';
      if (chat.agentId != 'default') {
        iconUrl = await getAgentIconUrl(chat.agentId);
        setIcon(<img src={iconUrl} alt='' className='rounded-md' />)
      }
      else {
        const modelIconUrl = await getModelIconUrlByModelId(chat.modelId);
        switch (chat.modelId) {
          case 'gpt-4-turbo':
            setIcon(<IconGPT4 />)
            break;
          case 'gpt-3.5-turbo':
            setIcon(<IconGPT />)
            break;
          case 'models/gemini-pro':
            setIcon(<IconGemini />)
            break;
          case 'claude-3-haiku-20240307':
            setIcon(<IconHaiku />)
            break;
          default:
            setIcon(<img src={modelIconUrl} alt='' />)
            break;
        }
      }
    })();
  }, [chat]);

  // const [newChatId, setNewChatId] = useLocalStorage('newChatId', null)
  const shouldAnimate = index === 0 && isActive;
  return (
    <motion.div
      className="relative min-h-14"
      variants={{
        initial: {
          height: 0,
          opacity: 0
        },
        animate: {
          height: 'auto',
          opacity: 1
        }
      }}
      initial={shouldAnimate ? 'initial' : undefined}
      animate={shouldAnimate ? 'animate' : undefined}
      transition={{
        duration: 0.25,
        ease: 'easeIn'
      }}
    >
      <div className={`${isActive ? 'bg-white/10' : ''} text-white/50 hover:bg-white/5 hover:text-white active:bg-white/10 transition-colors group flex items-center 
        text-sm font-medium w-full space-x-2 justify-between select-none`}
        onClick={(e) => {
          router.push(`/chat/${chat.id}`);
        }}
      >
        {/* <IconMessage className="mr-2 mt-1 text-zinc-500" /> */}
        <div className='flex items-center justify-start gap-x-2 min-w-0 w-full pr-4 py-2 text-sm group 
          cursor-default pl-2'
        >
          <div className='text-gray-300 size-9 shrink-0'>
            <div className='shrink-0 text-white size-9 rounded-md'>
              {icon}
            </div>
          </div>
          <div className='space-y-1 text-left w-full min-w-0'>
            <div className="truncate w-full font-medium text-gray-100 ">{chat.title}</div>
            <div className="text-xs text-white/50 font-normal truncate w-full h-5">
              {chat.overview}
            </div>
          </div>
        </div>
        {children}
      </div>

    </motion.div>
  )
}
