'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { SidebarToggle } from '@/components/chat/layout/sidebar-toggle'
import { ModelList } from '@/components/model-list';
import { SidebarMobile } from './sidebar-mobile';
import { ChatHistory } from '../chat-history';
import { cn } from '@/lib/utils'
import { Session } from '@/lib/types'

type AdminHeader = {
  path: string
  title: string
  description: string
}

const adminHeaders: AdminHeader[] = [
  {
    path: '/api-keys',
    title: 'API Keys',
    description: 'Activate OpenAI, Claude, PaLM models'
  },
  {
    path: '/models',
    title: 'Manage Models',
    description: 'Enable/disable models (GPT-3.5, GPT-4, Claude, etc.)'
  },
  {
    path: '/agents',
    title: 'AI Agents',
    description: 'Build smart AI agents'
  },
  {
    path: '/prompts',
    title: 'Prompts Library',
    description: 'Create a prompt library for your users'
  }
]

const getHeader = (path: string) => {
  return adminHeaders.find((header) => `/admin${header.path}` === path)
}

function UserOrLogin({ session, chats }: { session: Session, chats: any }) {
  return (
    <>
      <SidebarMobile session={session}>
        <ChatHistory session={session} chats={chats} />
      </SidebarMobile>
      <SidebarToggle />
    </>
  )
}

export function Header({ session, chats }: { session: Session, chats: any }) {
  const pathname = usePathname()
  // const isAdmin = pathname.startsWith('/admin')

  return (
    <header className={
      cn('sticky top-0 z-20',
        'flex items-center justify-between w-full p-2 shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl'
      )}>
      <div className='flex items-center'>
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin session={session} chats={chats} />
        </React.Suspense>
        {/* <SidebarToggle /> */}
        <ModelList />
      </div>
    </header>
  )
}
