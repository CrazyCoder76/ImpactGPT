'use client'

import * as React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import useStore from '@/lib/store'
import { Agent } from '@/lib/types'

export function AgentViewDialog({ agents, open, setOpen }: React.ComponentProps<'div'> & {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    agents: any[],
}) {

    const [search, setSearch] = React.useState('');
    const [filteredAgents, setFilteredAgents] = React.useState<any>([]);

    React.useEffect(() => {
        if (agents) {
            setFilteredAgents(agents.filter(agent =>
                agent.title.toLowerCase().includes(search.toLowerCase()) ||
                agent.description.toLowerCase().includes(search.toLowerCase())
            ));
        }
    }, [search, agents])

    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="max-w-3xl w-full h-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle className='text-center'>AI Agents</AlertDialogTitle>
                    <AlertDialogDescription>
                        AI agents are pre-built bots that you can chat with. AI agents are customized with specific context, training data, and model settings.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='flex items-start justify-start gap-2 overflow-auto whitespace-nowrap pt-1 pb-3'>
                    <Button className='w-fit inline-flex items-center px-3 py-2 border text-sm rounded-md focus:outline-none disabled:text-gray-500 gap-2 transition-colors justify-between bg-blue-100 hover:bg-blue-200 text-black border-blue-500 dark:bg-gray-700 dark:text-white'>
                        <span className='flex items-center justify-center gap-2'>
                            <svg stroke="currentColor" fill='currentColor' strokeWidth={0} viewBox='0 0 448 512' className='w-4 h-4' width="1em" height="1em" xmlns='http://www.w3.org/2000/svg'>
                                <path d="M436 160c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-20V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h320c26.5 0 48-21.5 48-48v-48h20c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-20v-64h20c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-20v-64h20zm-228-32c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zm112 236.8c0 10.6-10 19.2-22.4 19.2H118.4C106 384 96 375.4 96 364.8v-19.2c0-31.8 30.1-57.6 67.2-57.6h5c12.3 5.1 25.7 8 39.8 8s27.6-2.9 39.8-8h5c37.1 0 67.2 25.8 67.2 57.6v19.2z"></path>
                            </svg>
                            <span>Your AI Agents ({filteredAgents.length})</span>
                        </span>
                    </Button>
                </div>
                <div className='w-full'>
                    <div className='my-4 flex items-center justify-center gap-2 flex-col sm:flex-row'>
                        <Input
                            name='search'
                            value={search}
                            placeholder='Search AI agents...'
                            onChange={(e) => { setSearch(e.target.value) }}
                            className='w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700 bg-white text-black'
                        />
                        <select
                            className="custom-select block w-fit rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 dark:text-white dark:bg-zinc-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                        >
                            <option>↓ Title</option>
                            <option>Last Used</option>
                            <option>Last Created</option>
                        </select>
                    </div>
                </div>
                <div className='mt-4 space-y-2'>
                    <div className='grid sm:grid-cols-2 grid-cols-1 gap-2'>
                        {filteredAgents.map((agent: any, index: number) => (
                            <AgentCard agent={agent} key={index} openDlg={setOpen} />
                        ))}
                    </div>
                </div>
                <div className='mt-4 flex justify-center'>
                    <Button className='inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm' onClick={() => { setOpen(false) }}>
                        Close
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}

const AgentCard = ({ agent, openDlg }: { agent: Agent, openDlg: any }) => {

    const { setSelectedAgent } = useStore();
    return (
        <div className='border cursor-pointer w-full border-gray-200 rounded-xl overflow-hidden shadow-sm p-4 text-left flex flex-col items-start justify-between hover:shadow-md transition-all dark:border-gray-600 group hover:ring-4'
            onClick={() => { setSelectedAgent(agent); openDlg(false); }}>
            <div className='flex items-start justify-start gap-4 w-full'>
                <img src={agent.pictureUrl} className='error-fallback-gray flex-shrink-0 object-cover w-9 h-9 rounded-md ' />
                <div className='flex items-start justify-start gap-2 flex-col'>
                    <div className='text-md font-semibold flex items-center justify-center space-x-2 leading-6'>
                        {agent.title}
                    </div>
                    <div className='text-xs text-gray-500 mb-auto whitespace-pre-line line-clamp-2'>
                        {agent.description}
                    </div>
                </div>
                <Button className="opacity-0 group-hover:opacity-100 ml-auto text-blue-500">
                    <svg stroke="currentColor" fill='currentColor' strokeWidth={0} viewBox='0 0 1024 1024' className='w-5 h-5' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'>
                        <path d="M878.3 392.1L631.9 145.7c-6.5-6.5-15-9.7-23.5-9.7s-17 3.2-23.5 9.7L423.8 306.9c-12.2-1.4-24.5-2-36.8-2-73.2 0-146.4 24.1-206.5 72.3-15.4 12.3-16.6 35.4-2.7 49.4l181.7 181.7-215.4 215.2a15.8 15.8 0 0 0-4.6 9.8l-3.4 37.2c-.9 9.4 6.6 17.4 15.9 17.4.5 0 1 0 1.5-.1l37.2-3.4c3.7-.3 7.2-2 9.8-4.6l215.4-215.4 181.7 181.7c6.5 6.5 15 9.7 23.5 9.7 9.7 0 19.3-4.2 25.9-12.4 56.3-70.3 79.7-158.3 70.2-243.4l161.1-161.1c12.9-12.8 12.9-33.8 0-46.8z"></path>
                    </svg>
                </Button>
            </div>
            {/* <div className='mt-2 w-full'>
                <div className='flex items-center justify-end gap-4 flex-wrap'>
                    <Button className='text-base font-semibold text-blue-500 hover:underline group-hover:opacity-100 sm:opacity-0 flex items-center justify-center gap-1'>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox='0 0 448 512' className='w-4 h-4' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'>
                            <path d="M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"></path>
                        </svg>
                        Clone
                    </Button>
                    <Button className='text-base font-semibold text-red-500 hover:underline group-hover:opacity-100 sm:opacity-0 flex items-center justify-center gap-1'>
                        <svg stroke="currentColor" fill='currentColor' strokeWidth={0} viewBox='0 0 576 512' className='w-4 h-4' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'>
                            <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path>
                        </svg>
                        Edit
                    </Button>
                    <Button className='text-base font-semibold text-red-500 hover:underline group-hover:opacity-100 sm:opacity-0 flex items-center justify-center gap-1'>
                        <svg stroke="currentColor" fill='currentColor' strokeWidth={0} viewBox='0 0 448 512' className='w-4 h-4' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'>
                            <path d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path>
                        </svg>
                        Remove
                    </Button>
                    <Button className='anchor-char-share-button text-base font-semibold text-green-500 group-hover:opacity-100 sm:opacity-0 flex items-center justify-center gap-1 disabled:text-gray-500'>
                        <svg stroke="currentColor" fill='currentColor' strokeWidth={0} viewBox='0 0 448 512' className='w-4 h-4' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg'>
                            <path d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path>
                        </svg>
                        Share
                    </Button>
                </div>
            </div> */}
        </div>
    )
}