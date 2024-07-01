'use client'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { Sidebar } from '@/components/admin/layout/sidebar'
import { Button } from '@/components/ui/button'

import { IconSidebar } from '@/components/ui/icons'
import { auth } from '@/auth'
import { Session } from '@/lib/types';

export async function SidebarMobile({ session }: { session: Session }) {

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 flex size-9 p-0 lg:hidden">
          <IconSidebar className="size-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="inset-y-0 flex h-auto w-[320px] flex-col p-0"
      >
        <Sidebar className="flex" session={session} />
      </SheetContent>
    </Sheet>
  )
}