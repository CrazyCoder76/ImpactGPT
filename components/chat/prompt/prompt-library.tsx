'use client'

import { useEffect, useState } from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { toast } from 'sonner'

import { ServerActionResult, type Chat } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog'
import PromptForm from '@/components/admin/prompt/prompt-form'
import MyPromptList from './my-prompt-list'

import { IconSpinner } from '@/components/ui/icons';
import { Prompt, Session } from '@/lib/types'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { deletePromptById, getCommunityPrompts, getMyPrompts } from '@/app/admin/prompts/actions'

import { usePromptPanelStore } from '@/lib/store'
import CommunityPromptList from './community-prompt-list'

interface PromprLibraryProps extends DialogProps {
    onOpenChange: any,
    session: Session
}

export function PromptLibrary({ ...props }: PromprLibraryProps) {

    const [search, setSearch] = useState<string>("");
    const [myPrompts, setMyPrompts] = useState<Prompt[]>([]);
    const [communityPrompts, setCommunityPrompts] = useState<Prompt[]>([]);
    const [updateFlag, setUpdateFlag] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState(1);

    const { isUpdatingPrompt, isAddingPrompt, setIsAddingPrompt } = usePromptPanelStore();

    // Fetch my prompts and community prompts
    useEffect(() => {
        if (props.open == false) {
            setViewMode(1);
            return;
        }
        (async () => {
            // console.log('**** fetching 1 and 2*** ');
            setMyPrompts(await getMyPrompts());
            const res = await getCommunityPrompts();
            if (res.success) setCommunityPrompts(res.data || []);
        })();
    }, [props.open, updateFlag]);

    // Fetch community prompts
    useEffect(() => {
        if (viewMode == 1) return;
        // console.log('fetching community prompts');
        (async () => {
            const res = await getCommunityPrompts();
            if (res.success) setCommunityPrompts(res.data || []);
        })();
    }, [viewMode]);

    const onDeletePrompt = async (id: string) => {
        const res = await deletePromptById(id);
        setUpdateFlag((prevFlag) => (!prevFlag));
    }
    return (
        <Dialog {...props}>
            <DialogContent className='overflow-auto max-h-[700px]' style={{ scrollbarWidth: 'thin' }}>
                <div className='text-gray-800 dark:text-white text-left text-sm'>
                    <div>

                        <h2 data-element-id="prompt-library-modal-title" className="text-center text-2xl font-bold text-gray-800 dark:text-white">
                            Prompt Library
                        </h2>
                        <div data-element-id="prompt-library-modal-description" className="text-center text-gray-500 my-2">
                            Prompts are message templates that you can quickly fill in the chat input. Some prompts come with variables.
                        </div>

                        <div className='mt-4'>
                            <div className='sm:hidden'>
                                <label htmlFor="tabs" className="sr-only">Select a tab</label>
                                <select id="tabs" name="tabs" className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm dark:bg-zinc-800">
                                    <option value="user-prompts">Your Prompts</option>
                                    <option value="community-prompts">Community Prompts</option>
                                </select>
                            </div>
                            <div className='hidden sm:block'>
                                <div className='border-b border-gray-200'>
                                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                        <button onClick={() => { setViewMode(1); }}
                                            className={`${viewMode == 1 ? 'border-blue-500 text-blue-600' : ''}   dark:text-blue-500 flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`} >
                                            Your Prompts
                                            <span className=" bg-blue-100  ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block">{myPrompts ? myPrompts.length : 0}</span>
                                        </button>
                                        <button onClick={() => { setViewMode(2); }}
                                            className={`${viewMode == 2 ? 'border-blue-500 text-blue-600' : ''}   dark:text-blue-500 flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}>
                                            Community Prompts
                                            <span className=" bg-blue-100 ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block">{communityPrompts ? communityPrompts.length : 0}</span>
                                        </button></nav>
                                </div>
                            </div>
                        </div>

                        <div className='mt-4'>
                            <div className="my-4 flex items-center justify-center gap-2">
                                <input type="text" placeholder="Search your prompts" value={search} onChange={(e) => { setSearch(e.target.value) }} data-element-id="search-your-prompts" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800" />
                                {viewMode == 1 && <div className="text-center">
                                    <button onClick={() => { setIsAddingPrompt(true); }} data-element-id="add-prompt-button" className="text-blue-500 hover:underline inline-flex justify-center items-center font-semibold space-x-1 shrink-0 truncate py-2 px-2">
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z"></path>
                                            <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8Z"></path>
                                        </svg>
                                        <span>Add Prompt</span>
                                    </button>
                                </div>}
                            </div>
                            {
                                isAddingPrompt &&
                                <PromptForm params={{
                                    mode: 'add', onUpdateHander: setUpdateFlag,
                                }} />
                            }
                            {
                                isUpdatingPrompt &&
                                <PromptForm params={{
                                    mode: 'update', onUpdateHander: setUpdateFlag,
                                }} />
                            }
                            {
                                (viewMode == 1 && isUpdatingPrompt == false) ? <MyPromptList search={search} session={props.session} prompts={myPrompts} onDeletePrompt={onDeletePrompt} /> :
                                    viewMode == 2 ? <CommunityPromptList prompts={communityPrompts} /> : <></>
                            }

                        </div>
                    </div>
                    <div className="mt-5 sm:mt-6 text-center">
                        <button onClick={() => { props.onOpenChange(false); }} data-element-id="close-modal-button" type="button" className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-2 py-1 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
