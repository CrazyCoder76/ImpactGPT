import { Header } from '@/components/chat/layout/header'
import { SidebarDesktop } from '@/components/chat/layout/sidebar-desktop'
import { auth, signOut } from '@/auth'
import { cn } from '@/lib/utils'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'
import { getUserByEmail } from '@/actions/user'
import { getChatList } from '@/app/(chat)/actions'

interface ChatLayoutProps {
  children: React.ReactNode
}
/*
h-[calc(100vh_-_theme(spacing.16))]
*/
export default async function ChatLayout({ children }: ChatLayoutProps) {
  const session = (await auth()) as Session;
  const chats = await getChatList();

  if (!session?.user?.id) {
    redirect('/auth/login')
  }
  const user = await getUserByEmail(session.user.email);
  if (user == null) {
    redirect('/auth/login');
  }
  {/* @ts-ignore */ }
  if (user?.role == 0) {
    redirect('/admin');
  }
  return (
    <div className="relative flex">
      <SidebarDesktop session={session} chats={chats} />
      <main className={cn('group h-screen w-full overflow-auto pl-0 flex flex-col peer-[[data-state=open]]:lg:pl-[320px]')}>
        <div className='flex flex-col'>
          <Header session={session} chats={chats} />
          {children}
        </div>
      </main>
    </div>
  )
}
