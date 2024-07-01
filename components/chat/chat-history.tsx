import * as React from 'react'

// import Link from 'next/link'

import { cn } from '@/lib/utils'
import { SidebarList } from '@/components/chat/layout/sidebar-list'
import { Session } from '@/lib/types'
// import { buttonVariants } from '@/components/ui/button'
// import { IconPlus } from '@/components/ui/icons'

// interface ChatHistoryProps {
//   userId?: string
// }

export async function ChatHistory({ session, chats }: { session: Session, chats: any }) {

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* <React.Suspense
        fallback={
          <div className="flex flex-col flex-1 px-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-6 rounded-md shrink-0 animate-pulse bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        }
      > */}
      <SidebarList session={session} chats={chats} />
      {/* </React.Suspense> */}
    </div>
  )
}
