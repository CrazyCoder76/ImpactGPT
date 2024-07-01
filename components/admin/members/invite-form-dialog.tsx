'use client'

import { IconArrowRight } from "@/components/ui/icons"
import { type DialogProps } from "@radix-ui/react-alert-dialog"
import { Dialog, DialogContent } from '@/components/ui/dialog'
import React, { SetStateAction } from "react"
import useStore from "@/lib/store"

interface InviteFormDialogProps extends DialogProps {
    setPageState: React.Dispatch<SetStateAction<number>>
}

const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export function InviteFormDialog({ ...props }: InviteFormDialogProps) {
    const { setPageState } = props;
    const { currentUser } = useStore();
    const [emails, setEmails] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string>('');
    const [pending, setPending] = React.useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        const lines = value.split('\n').map(line => line.trim());
        const invalidEmails = lines.filter(email => email && !validateEmail(email));

        if (invalidEmails.length > 0) {
            setError(`Some emails in the list are invalid.`)
        } else {
            setError('');
        }
        setEmails(lines);
    }

    const handleInviteMembers = () => {
        console.log(currentUser);
        console.log(emails.filter(email => email))
    }

    return (
        <>
            <Dialog {...props}>
                <DialogContent className="w-[400px]">
                    <div>
                        <div className="text-gray-800 text-left text-sm">
                            <h2 className="text-lg text-center my-4 font-semibold">
                                Invite Members
                            </h2>
                            <div className="flex flex-col items-center">
                                <span className="text-gray-500">Enter your team members&apos;s email addresses here</span>
                                <span className="font-semibold my-2">One email per line.</span>
                            </div>
                            <textarea
                                rows={5}
                                value={emails.join('\n')}
                                onChange={handleChange}
                                placeholder={`john@example.com\nalice@yourdomain.com\n...`}
                                className="relative block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 px-3 py-2">
                            </textarea>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                            <div className="flex items-center justify-center gap-2 mt-4">
                                <button disabled={emails.filter(email => email !== '').length === 0 || !!error} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap space-x-1" onClick={() => { handleInviteMembers() }}>
                                    <IconArrowRight className="mr-1" />
                                    Add Members
                                </button>
                                <button
                                    onClick={() => setPageState(0)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap space-x-1">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}