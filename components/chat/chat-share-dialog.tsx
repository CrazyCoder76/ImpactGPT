'use client'

import * as React from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { toast } from 'sonner'

import { ServerActionResult, type Chat } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { IconSpinner } from '@/components/ui/icons'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'

interface ChatShareDialogProps extends DialogProps {
    chat: Chat
    shareChat: (id: string) => any
    onCopy: () => void
}

export function ChatShareDialog({
    chat,
    shareChat,
    onCopy,
    ...props
}: ChatShareDialogProps) {
    const { copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
    const [isSharePending, startShareTransition] = React.useTransition()

    const copyShareLink = React.useCallback(
        async (sharePath: string) => {
            const url = new URL(window.location.href)
            url.pathname = sharePath
            copyToClipboard(url.toString())
            onCopy()
            toast.success('Share link copied to clipboard', {
                duration: 2000
            })
        },
        [copyToClipboard, onCopy]
    )

    return (
        <Dialog {...props}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share link to chat</DialogTitle>
                    <DialogDescription>
                        Anyone with the URL will be able to view the shared chat.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4 space-y-1 text-sm border rounded-md">
                    <div className="font-medium">{chat.title}</div>
                    <div className="text-muted-foreground">
                        {chat.overview}
                    </div>
                </div>
                <DialogFooter className="items-center">
                    <Button
                        disabled={isSharePending}
                        className='bg-blue-400 p-5 hover:bg-blue-600'
                        onClick={() => {
                            startShareTransition(async () => {
                                const result = await shareChat(chat.id);
                                if (result && result?.error) {
                                    toast.error(result.error, {
                                        duration: 2000
                                    });
                                    return;
                                }
                                copyShareLink(result.sharePath)
                            })
                        }}
                    >
                        {isSharePending ? (
                            <>
                                <IconSpinner className="mr-2 animate-spin" />
                                Copying...
                            </>
                        ) : (
                            <>Copy link</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
