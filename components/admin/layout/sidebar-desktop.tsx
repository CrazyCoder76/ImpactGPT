import { Sidebar } from '@/components/admin/layout/sidebar'

import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { ChatHistory } from '@/components/chat/chat-history'
import { json } from 'stream/consumers'
// import { SidebarHistoryList } from './sidebar-history-list'


export function SidebarDesktop({ session }: { session: Session }) {
  const name = session?.user?.name;

  return (
    <Sidebar className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px]"
      session={session} />
  )
}
