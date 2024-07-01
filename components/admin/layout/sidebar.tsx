'use client'

import * as React from 'react'
import Link from 'next/link'

import { useSidebar } from '@/lib/hooks/use-sidebar'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { logout } from '@/app/(chat)/actions'
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
  IconLibrary,
  IconMember,
  IconUser,
  IconEmail
} from '@/components/ui/icons'
import { Session } from '@/lib/types'
import useStore from '@/lib/store'
import { GearIcon } from '@radix-ui/react-icons'

export interface SidebarProps extends React.ComponentProps<'div'> {
  session: Session
}

export function Sidebar({ className, session }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar()
  const { setCurrentUser } = useStore();

  React.useEffect(() => {
    if (session) {
      setCurrentUser(session);
    }
  }, [session, setCurrentUser]);

  return (
    <div data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className={cn(className, 'h-full flex-col bg-white dark:bg-zinc-950')}>
      <div
        className='lg:fixed lg:inset-y-0 lg:flex lg:w-[320px] flex flex-col z-[60] transition duration-300 border-r border-gray-200 bg-white justify-between h-full'
      >
        <div className='p-6 flex flex-col grow overflow-auto'>
          <div className='inline-flex items-center gap-x-2'>
            <Link href='' target='_blank' className='w-11 h-8 rounded-lg overflow-hidden'>
              <img src='https://impactmindai435-res.cloudinary.com/image/upload/w_1000,ar_16:9,c_fill,g_auto,f_auto/v1717946375/impactchat/ImpactChat-Cover101_rwpkdn.webp' className='h-full w-full' />
            </Link>
            <div className='inline-flex justify-between w-full items-center'>
              <div>
                <Link href='/' className='text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors'>
                  Impact Mind, AI
                </Link>
                <p className='text-sm text-gray-500 capitalize font-normal'>
                  <Link href='/admin/billing' className='hover:underline'>Free Plan</Link>
                </p>
              </div>
              <div className='relative inline-block text-left'>
                <div>
                  <Button variant='default' className='text-gray-500 hover:bg-gray-100 rounded p-2 h-fit aspect-square focus:outline-blue-500 focus:bg-gray-100'>
                    <IconChevronUpDown />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className='my-5'>
            <div className='relative mt-2 rounded-md'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <IconMagnifier />
              </div>
              <Input
                type='search'
                name='admin-search-bar'
                placeholder='Search settings...'
                className='w-full rounded-md border border-gray-400/60 py-2 pl-10 text-gray-900 placeholder:text-gray-400 sm:text-sm bg-white'
              />
            </div>
          </div>
          <nav className='flex flex-col flex-1'>
            <ul className='flex grow flex-col gap-y-7'>
              <li className='flex flex-col justify-between grow'>
                <ul className='flex flex-col gap-y-1'>
                  <li>
                    <Link href='/admin' className='text-gray-700 hover:text-blue-600 hover:bg-gray-100 group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm leading-6 font-medium'>
                      <IconChart />
                      Dashboard
                    </Link>
                  </li>
                  <li className='pt-3 pb-4'><div className='h-px w-full bg-gray-200'></div></li>
                  <li className='w-full font-medium text-xs text-gray-500 mb-0.5'>General</li>
                  <li>
                    <Link href='/admin/settings' className='text-gray-700 hover:text-blue-600 hover:bg-gray-100 group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm leading-6 font-medium'>
                      <GearIcon />
                      General Settings
                    </Link>
                  </li>
                  <li>
                    <Link href='/admin/api-keys' className='text-gray-700 hover:text-blue-600 hover:bg-gray-100 group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm leading-6 font-medium'>
                      <IconMagnifierR />
                      API Keys
                    </Link>
                  </li>
                  <li>
                    <Link href='/admin/models' className='text-gray-700 hover:text-blue-600 hover:bg-gray-100 group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm leading-6 font-medium'>
                      <IconBlocks />
                      Manage Models
                    </Link>
                  </li>
                  <li className='pt-3 pb-4'><div className='h-px w-full bg-gray-200'></div></li>
                  <li className='w-full font-medium text-xs text-gray-500 mb-0.5'>Data Management</li>
                  <li>
                    <Link href='/admin/agents' className='text-gray-700 hover:text-blue-600 hover:bg-gray-100 group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm leading-6 font-medium'>
                      <IconAgent />
                      AI Agents
                    </Link>
                  </li>
                  <li>
                    <Link href='/admin/prompts' className='text-gray-700 hover:text-blue-600 hover:bg-gray-100 group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm leading-6 font-medium'>
                      <IconLibrary />
                      Prompts Library
                    </Link>
                  </li>
                  <li className='pt-3 pb-4'><div className='h-px w-full bg-gray-200'></div></li>
                  <li className='w-full font-medium text-xs text-gray-500 mb-0.5'>Account & Access</li>
                  <li>
                    <Link href='/admin/members' className='text-gray-700 hover:text-blue-600 hover:bg-gray-100 group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm leading-6 font-medium'>
                      <IconMember />
                      Members
                    </Link>
                  </li>
                  <li>
                    <Link href='/admin/groups' className='text-gray-700 hover:text-blue-600 hover:bg-gray-100 group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm leading-6 font-medium'>
                      <IconMember />
                      Groups
                    </Link>
                  </li>
                  <li className='pt-3 pb-4'><div className='h-px w-full bg-gray-200'></div></li>
                  <li className='w-full font-medium text-xs text-gray-500 mb-0.5'>Customization</li>
                  <li>
                    <Link href='/admin/email-settings' className='text-gray-700 hover:text-blue-600 hover:bg-gray-100 group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm leading-6 font-medium'>
                      <IconEmail />
                      Email Settings
                    </Link>
                  </li>
                </ul>
                <li className='flex justify-between items-center pt-10'>
                  <span className='text-gray-700 group flex items-center gap-x-2 rounded-md px-2 py-1.5 text-sm leading-6 font-medium'>
                    <IconUser />
                    <span className='truncate max-w-[100px] sm:max-w-lg'>{session?.user?.name}</span>
                  </span>
                  <form action={logout}>
                    <button
                      className="flex items-center gap-3.5 text-sm truncate font-medium duration-300 ease-in-out hover:text-gray-500"
                    >
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
                          fill=""
                        />
                        <path
                          d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
                          fill=""
                        />
                      </svg>
                      Log out
                    </button>
                  </form>
                </li>
              </li>
            </ul>
          </nav>
          {/* <div className='relative inline-flex justify-between gap-2 w-full rounded-none'>
            <div className="flex gap-2">
              <div className='shrink-0 size-6 rounded-sm'>
                <IconUser />
              </div>
              <span className='truncate max-w-[100px] sm:max-w-lg'>{session?.user?.name}</span>
            </div>
            
          </div> */}
        </div>
      </div>
    </div>
  )
}
