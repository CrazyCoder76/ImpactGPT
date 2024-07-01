'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { ServerActionResult, type Chat } from '@/lib/types'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { IconDelete, IconMenu, IconShare, IconSpinner, IconTrash } from '@/components/ui/icons'
import { ChatShareDialog } from '../chat-share-dialog'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { deleteChat } from '@/app/(chat)/actions'

interface SidebarActionsProps {
    chat: Chat
    shareChat: (id: string) => void
    // removeChat: (args: { id: string; path: string }) => ServerActionResult<void>
    // shareChat: (id: string) => ServerActionResult<Chat>
}

export function SidebarActions({
    chat,
    // removeChat,
    shareChat
}: SidebarActionsProps) {
    const router = useRouter()
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
    const [isRemovePending, startRemoveTransition] = React.useTransition()

    return (
        <>
            <div className="pr-4">
                <div className="flex items-center justify-center space-x-2">
                    <button onClick={(e) => {
                        e.stopPropagation();
                        setDeleteDialogOpen(true);
                    }} className="cursor-default text-white/50 hover:text-white transiton-all  inline-block sm:hidden group-hover:inline-block group-focus-within:inline-block">
                        <IconDelete className='w-6 h-6' />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setShareDialogOpen(true); }}
                        className="cursor-default text-white/50 hover:text-white transiton-all  inline-block sm:hidden group-hover:inline-block group-focus-within:inline-block">
                        <IconShare fill='currentColor' className='w-5 h-5' />
                    </button>
                    <div className="relative flex text-left" data-headlessui-state="">
                        <button className="cursor-default text-white/50 hover:text-white transiton-all inline-block sm:hidden group-hover:inline-block  group-focus-within:inline-block" id="headlessui-menu-button-:r56:" type="button" aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
                            <IconMenu />
                        </button>
                    </div>
                </div>
            </div>
            <ChatShareDialog
                chat={chat}
                shareChat={shareChat}
                open={shareDialogOpen}
                onOpenChange={setShareDialogOpen}
                onCopy={() => setShareDialogOpen(false)}
            />
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete your chat message and remove your
                            data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isRemovePending} className=' inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap gap-1'>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isRemovePending}
                            className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap gap-1'
                            onClick={event => {
                                event.preventDefault()
                                startRemoveTransition(async () => {
                                    const result = await deleteChat(chat.id);
                                    if (result?.status === 200) {
                                        router.refresh();
                                        setDeleteDialogOpen(false)
                                        toast.success('Chat deleted', {
                                            duration: 2000
                                        })
                                    }
                                    else {
                                        toast.error('Something went wrong', {
                                            duration: 2000
                                        })
                                    }
                                })
                            }}
                        >
                            {isRemovePending && <IconSpinner className="mr-2 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
