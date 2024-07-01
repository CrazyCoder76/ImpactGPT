import { Sidebar } from '@/components/chat/layout/sidebar'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { ChatHistory } from '@/components/chat/chat-history'
// import { getUserById } from '@/actions/user'
// import { SidebarHistoryList } from './sidebar-history-list'


export async function SidebarDesktop({ session, chats }: { session: Session, chats: any }) {

  return (
    <Sidebar session={session} className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[320px]">
      {/* @ts-ignore */}
      <ChatHistory session={session} chats={chats} />
    </Sidebar>
  )
}
