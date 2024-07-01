
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconSpinner } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Prompt } from "@/lib/types";
// import { WorkMode } from '@/app/admin/prompts/page';

import { addNewPrompt, updatePrompt } from '@/app/admin/prompts/actions';
import { usePromptPanelStore } from '@/lib/store';

type PromptForm = {
    mode: string,
    onUpdateHander?: any,
}
interface PromptFormPros {
    params: PromptForm;
}

export default function PromptForm({ params }: PromptFormPros) {

    const { setIsUpdatingPrompt, setIsAddingPrompt, promptOnUpdating } = usePromptPanelStore();

    const initialTitle = params.mode === 'add' ? '' : promptOnUpdating?.title || '';
    const [title, setTitle] = useState(initialTitle);

    const initialDescription = params.mode === 'add' ? '' : promptOnUpdating?.description || '';
    const [description, setDescription] = useState(initialDescription);

    const initialPrompt = params.mode === 'add' ? '' : promptOnUpdating?.prompt || '';
    const [prompt, setPrompt] = useState(initialPrompt);
    const [errorMsg, setErrorMsg] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const validate = () => {
        if (title.length == 0 || prompt.length == 0) {
            setErrorMsg('Title and prompt cannot be empty!');
            return false;
        }
        else setErrorMsg('');
        return true;
    }

    const handleClick = async () => {
        if (params.mode == 'add') {
            if (validate()) {
                // Add a new prompt template
                const data: Prompt = {
                    _id: '#',
                    title: title,
                    description: description,
                    prompt: prompt,
                }
                setIsRunning(true);
                const res = await addNewPrompt(data);
                setIsRunning(false);
                if (!res.success) {
                    setErrorMsg(res.message);
                }
                else {
                    setIsAddingPrompt(false);
                    if (params.onUpdateHander) params.onUpdateHander((prevFlag: any) => (!prevFlag));
                }
            }
        }
        if (params.mode == 'update') {
            if (validate()) {
                if (promptOnUpdating == undefined || promptOnUpdating._id == undefined) return;
                const res = await updatePrompt(promptOnUpdating._id, {
                    _id: promptOnUpdating._id,
                    title: title,
                    description: description,
                    prompt: prompt
                });
                if (!res.success) {
                    setErrorMsg(res.message || 'error');
                }
                else {
                    setIsUpdatingPrompt(false);
                    params.onUpdateHander((prevFlag: any) => (!prevFlag));
                }
            }

        }
    }
    return (
        <div>
            <div data-element-id="add-new-prompt-title" className="font-semibold my-1">Title:</div>
            <input data-element-id="add-new-prompt-title-input" type="text" placeholder="Prompt Title (e.g., 'Domain Names Inspirations')" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700"
                value={title} onChange={(e) => { setTitle(e.currentTarget.value); }} />

            <div data-element-id="add-new-prompt-description" className="font-semibold mb-1 mt-3">Description (optional):</div>
            <input data-element-id="add-new-prompt-description-input" type="text" placeholder="E.g., A list of domain names based on topics" className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700"
                value={description} onChange={(e) => { setDescription(e.currentTarget.value); }} />

            <div data-element-id="add-new-prompt-tags" className="font-semibold mb-1 mt-3">Tags (optional):</div>

            <div className=" mb-1 mt-3">
                <span data-element-id="add-new-prompt" className="font-semibold ">Prompt:</span>
                <span className="text-xs ml-2">
                    Use
                    <code className="text-xs bg-gray-200 dark:bg-zinc-900">{`{{field 1}} `}</code>
                    <code className="text-xs bg-gray-200 dark:bg-zinc-900">{` {{field 2}} `}</code>
                    <code className="text-xs bg-gray-200 dark:bg-zinc-900">{` {{or anything}} `}</code>
                    to indicate the fill in the blank part.
                </span>
            </div>

            <textarea className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700"
                placeholder="Enter your prompt here..." data-element-id="add-new-prompt-input"
                style={{ height: '89.8113px !important' }} value={prompt}
                onChange={(e) => { setPrompt(e.currentTarget.value); }} />
            <p className="my-2 text-sm text-red-500"> {errorMsg} </p>
            <div className="my-2 text-center flex items-center justify-center">
                <button disabled={isRunning} data-element-id="add-new-prompt-button" className="min-w-24 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap gap-1"
                    onClick={() => {
                        handleClick();
                    }} >
                    {
                        isRunning ? <IconSpinner /> : (
                            <>
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="w-4 h-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z"></path>
                                    <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8Z"></path>
                                </svg>
                                <span>{params.mode == 'add' ? 'Add Prompt' : 'Update Prompt'}</span>
                            </>
                        )
                    }
                </button>
                <button className=" text-black dark:text-white transition font-bold py-2 px-4 rounded inline-flex space-x-1 justify-center items-center disabled:opacity-50"
                    onClick={(e: any) => { setIsUpdatingPrompt(false); setIsAddingPrompt(false); }}>
                    <span>Cancel</span>
                </button>
            </div>
        </div>
    )
}