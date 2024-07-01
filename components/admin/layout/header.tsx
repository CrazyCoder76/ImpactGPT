'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { SidebarToggle } from '@/components/chat/layout/sidebar-toggle'
import { ModelList } from '@/components/model-list';
import { SidebarMobile } from './sidebar-mobile';
import { Session } from '@/lib/types'
// import { ChatHistory } from '../chat-history';
import { cn } from '@/lib/utils'

type AdminHeader = {
  path: string
  title: string
  description: string
}

const adminHeaders: AdminHeader[] = [
  {
    path: '',
    title: 'Dashboard',
    description: ''
  },
  {
    path: '/settings',
    title: 'General Settings',
    description: 'Customize branding, logo, banner, etc.'
  },
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
  },
  {
    path: '/members',
    title: 'Members',
    description: 'List of users who can use your chat instance'
  },
  {
    path: '/groups',
    title: 'Groups',
    description: ''
  },
  {
    path: '/email-settings',
    title: 'Email Settings',
    description: 'Customize emails sent to your users'
  }
]

const getHeader = (path: string) => {
  return adminHeaders.find((header) => `/admin${header.path}` === path)
}

// async function UserOrLogin() {
//   return (
//     <>
//       <SidebarMobile />
//     </>
//   )
// }

export function Header({ session }: { session: Session }) {
  const pathname = usePathname();
  const header = getHeader(pathname);
  return (
    <header className={cn('sticky top-0 z-20 bg-white shadow')}>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          <div className='flex gap-2 items-center'>
            <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
              <SidebarMobile session={session} />
            </React.Suspense>
            <div className='flex items-start justify-center flex-col w-full'>
              <h1 className='text-xl text-left font-medium whitespace-nowrap'>
                {header && header.title}
              </h1>
              <div className='text-gray-500 text-sm hidden sm:block truncate w-full'>
                {header && header.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
