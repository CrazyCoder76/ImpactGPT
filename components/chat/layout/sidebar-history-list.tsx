'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

import HistoryAvatar from '@/public/english-teacher.png'

interface IHistory {
  _id?: string
  image: string
  title: string
  description: string
}

export interface SidebarHistoryListProps extends React.ComponentProps<'div'> { }

export function SidebarHistoryList({ className }: SidebarHistoryListProps) {
  const histories: IHistory[] = [
    {
      image: HistoryAvatar.src,
      title: '(Example) Writing Content',
      description: ' Here is a draft tech article on how to use Apple'
    }
  ];

  return (
    <div className={cn(className, 'flex flex-col')}>
      {histories.map((history: IHistory, index: number) => (
        <div key={index} className='hover:bg-white/5 flex gap-x-2 p-2 pr-4'>
          <div className='flex gap-x-2 items-center'>
            <div className='flex-shrink-0 text-gray-300 h-9 w-9'>
              <img src={history.image} alt="History image" className='flex-shrink-0 rounded-md error-fallback-gray' />
            </div>
            <div className='space-y-1'>
              <p className='truncate w-full font-medium text-gray-100 text-sm'>{history.title}</p>
              <p className='text-xs text-white/50 font-normal truncate w-full h-5'>{history.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
