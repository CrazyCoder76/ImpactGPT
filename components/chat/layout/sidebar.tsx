'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { useSidebar } from '@/lib/hooks/use-sidebar'
import { cn } from '@/lib/utils'
import { Session } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarList } from '@/components/chat/layout/sidebar-list'
import {
  IconMessage,
  IconLayer,
  IconFolder,
  IconBookmark,
  IconDualCheck,
  IconChevronUpDown,
  IconCheck,
  IconCirclePlus,
  IconMagnifier,
  IconChart,
  IconMagnifierR,
  IconBlocks,
  IconAgent,
  IconLibrary
} from '@/components/ui/icons'

import { newChat } from '@/app/(chat)/actions'
export interface SidebarProps extends React.ComponentProps<'div'> {
  session: Session
}

export function Sidebar({ className, children, session }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar()
  const router = useRouter();

  const handleNewChat = async (e: any) => {
    await newChat();
  }
  return (
    <div data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className={cn(className, 'h-full flex-col dark:bg-zinc-950 bg-primary-background')}>
      <div className="p-2 flex flex-col gap-y-2">
        <div className="flex gap-x-2">
          <Button className="flex-1" onClick={handleNewChat}>
            {/* <Link href='/'> */}
            <IconMessage className="mr-2" />
            <p>New Chat</p>
            {/* </Link> */}
          </Button>
          {/* <Button className="p-2">
            <IconLayer />
          </Button> */}
        </div>
        {/* <div className="flex gap-x-2">
          <Input placeholder="Search chats..." />
          <div className="flex items-center gap-x-2.5">
            <Button variant="outline">
              <IconFolder />
            </Button>
            <Button variant="outline">
              <IconBookmark />
            </Button>
            <Button variant="outline">
              <IconDualCheck />
            </Button>
          </div>
        </div> */}
      </div>
      {children}
    </div>
  )
}
