import { Header } from '@/components/admin/layout/header'
import { SidebarDesktop } from '@/components/admin/layout/sidebar-desktop'
import { auth } from '@/auth'
import { notFound, redirect } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Session } from '@/lib/types'
import { getUserByEmail } from '@/actions/user'

interface ChatLayoutProps {
  children: React.ReactNode
}
/*
h-[calc(100vh_-_theme(spacing.16))]
*/
export default async function AdminLayout({ children }: ChatLayoutProps) {
  const session = (await auth()) as Session;
  console.log({ session });

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) redirect('/auth/login');

  {/* @ts-ignore */ }
  if (user?.role != 0) {
    redirect('/');
  }
  return (
    <div className="relative flex">
      <SidebarDesktop session={session} />
      <main className={cn('group h-screen w-full overflow-auto pl-0 flex flex-col peer-[[data-state=open]]:lg:pl-[320px]')}>
        <div className='flex flex-col h-full'>
          <Header session={session} />
          <div className='grow bg-gray-50 p-6 pb-20'>
            <div className='mx-auto duration-300 '>{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
