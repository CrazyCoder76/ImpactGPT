'use client'

import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue, useStreamableValue } from 'ai/rsc'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { CodeBlock } from '@/components/ui/codeblock'
import { IconCopy, IconEdit, IconGPT, IconGallery, IconMore, IconOpenAI, IconUser, IconError } from '@/components/ui/icons'
import { spinner } from '@/components/details/spinner'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'
import { cn } from '@/lib/utils'
import { Message } from '@/lib/types'

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4 rounded-lg mb-2 '>
      <div className='pl-14 relative response-block scroll-mt-32 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 py-2 pr-2 group/root min-h-[52px] opacity-100 translate-y-0'>
        <div className='absolute top-2 left-2'>
          <Button variant='default' className='size-9 bg-gray-200 rounded-md  flex-none flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-all  active:bg-gray-200 overflow-hidden hover:opacity-80'>
            <IconUser className='inline-block group-hover/root:hidden' />
            <IconGallery className='hidden group-hover/root:inline-block' />
          </Button>
        </div>
        {/* <div>
          <div className='absolute -bottom-3 right-4 items-start justify-center gap-1 hidden group-hover/root:flex'>
            <Button variant='default' className='rounded-full h-auto border bg-gray-100 dark:bg-gray-700 border-gray-300 px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex overflow-hidden items-center justify-center text-gray-500 active:bg-gray-300 dark:active:bg-gray-800 gap-1 hover:text-blue-500'>
              <IconEdit />
            </Button>
            <Button variant='default' className='rounded-full h-auto border bg-gray-100 dark:bg-gray-700 border-gray-300 px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex overflow-hidden items-center justify-center text-gray-500 active:bg-gray-300 dark:active:bg-gray-800 gap-1'>
              <IconCopy />
            </Button>
            <Button variant='default' className='rounded-full h-auto border bg-gray-100 dark:bg-gray-700 border-gray-300 px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex overflow-hidden items-center justify-center text-gray-500 active:bg-gray-300 dark:active:bg-gray-800 gap-1'>
              <IconMore />
            </Button>
          </div>
        </div> */}
        <div className='w-full'>
          <div>
            <div className=' break-words whitespace-pre-wrap space-y-2 w-fit text-white px-3 py-2 rounded-lg max-w-full overflow-auto highlight-darkblue focus:outline text-sm bg-blue-500 dark:bg-message-user-dark'>
              {children}
            </div>
          </div>
        </div>
        {/* <div className='hidden group-hover:block text-xs text-gray-500 text-right shrink-0 absolute right-0 top-1 bg-gray-50 dark:bg-zinc-900 px-2 rounded-full'>
          <div className='flex items-center'>01:22</div>
        </div> */}
      </div>
    </div>
  )
}

export function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4 rounded-lg mb-2 '>
      <div className='pl-14 relative response-block scroll-mt-32 rounded-md bg-gray-50 dark:hover:bg-white/5 py-2 pr-2 group/root min-h-[52px] opacity-100 translate-y-0'>
        <div className='absolute top-2 left-2'>
          <Button variant='default' className='relative size-9 flex'>
            <div className='shrink-0 text-white size-9 rounded-md flex justify-center items-center'>
              <IconError className='inline-block group-hover/root:hidden' />
            </div>
          </Button>
        </div>
        <div className='w-full'>
          <div>
            <div className='break-words whitespace-pre-wrap space-y-2 w-fit text-black py-2 rounded-lg max-w-full overflow-auto highlight-darkblue focus:outline text-sm'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BotMessage({ content, icon, className }: {
  content: string,
  icon: React.ReactNode,
  className?: string
}) {
  // const text = useStreamableText(content)

  return (
    <div className='px-4 rounded-lg mb-2'>
      <div className='group/root pl-14 relative response-block scroll-mt-32 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 pb-2 pt-2 pr-2  min-h-[52px]'>
        <div className='absolute top-2 left-2'>
          <Button variant='default' className='relative w-9 h-9 flex'>
            <div className='flex-shrink-0 text-white w-9 h-9 rounded-md'>
              {icon}
            </div>
          </Button>
        </div>
        {/* <div>
          <div className='absolute -bottom-10 right-4 items-start justify-center gap-1 hidden group-hover/root:flex'>
            <Button variant='default' className='rounded-full h-auto border bg-gray-100 dark:bg-gray-700 border-gray-300 px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex overflow-hidden items-center justify-center text-gray-500 active:bg-gray-300 dark:active:bg-gray-800 gap-1 hover:text-blue-500'>
              <IconEdit />
            </Button>
            <Button variant='default' className='rounded-full h-auto border bg-gray-100 dark:bg-gray-700 border-gray-300 px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex overflow-hidden items-center justify-center text-gray-500 active:bg-gray-300 dark:active:bg-gray-800 gap-1'>
              <IconCopy />
            </Button>
            <Button variant='default' className='rounded-full h-auto border bg-gray-100 dark:bg-gray-700 border-gray-300 px-2 py-1 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex overflow-hidden items-center justify-center text-gray-500 active:bg-gray-300 dark:active:bg-gray-800 gap-1'>
              <IconMore />
            </Button>
          </div>
        </div> */}
        <div className='w-full'>
          <MemoizedReactMarkdown
            className="prose max-w-full dark:prose-invert break-words prose-sm"
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>
              },
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == '▍') {
                    return (
                      <span className="mt-1 animate-pulse cursor-default">▍</span>
                    )
                  }

                  children[0] = (children[0] as string).replace('`▍`', '▍')
                }

                const match = /language-(\w+)/.exec(className || '')

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                )
              }
            }}
          >
            {content}
          </MemoizedReactMarkdown>
        </div>
        {/* <div className='hidden group-hover:block text-xs text-gray-500 text-right shrink-0 absolute right-0 top-1 bg-gray-50 dark:bg-zinc-900 px-2 rounded-full'>
          <div className='flex items-center'>01:22</div>
        </div> */}
      </div>
    </div>
  )
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <IconOpenAI />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm">
        <IconOpenAI />
      </div>
      <div className="ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}
