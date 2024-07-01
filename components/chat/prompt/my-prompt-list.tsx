"use client"


import { useEffect, useState } from 'react';
import { Prompt, Session } from '@/lib/types';
import { usePromptPanelStore } from '@/lib/store';

const MyPromptList = ({ search, prompts, onDeletePrompt, session }: { search: string, prompts: Prompt[], onDeletePrompt: any, session: Session }) => {
    const { setIsUpdatingPrompt, setIsAddingPrompt,
        setPromptOnUpdating, onUsePromptHandler } = usePromptPanelStore();

    const filteredPrompts = prompts.filter(prompt =>
        prompt.title.toLowerCase().includes(search.toLowerCase()) ||
        (prompt.description?.toLowerCase() || '').includes(search.toLowerCase())
    );

    if (!session?.user) return <></>
    return (
        <div>
            {
                filteredPrompts && filteredPrompts.map((prompt: Prompt) => (
                    <div key={prompt?._id} className="p-4 border border-gray-200 dark:border-gray-600 rounded shadow-sm mb-4 flex items-center justify-between space-x-2 gap-3">
                        <div className="w-full">
                            <div className="flex items-center justify-between gap-2 mt-1">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-start gap-2">
                                        <button className="shrink-0 hover:scale-110 transition-all">
                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" className="text-yellow-500 w-6 h-6" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                                            </svg>
                                        </button>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{prompt.title}</h3>
                                    </div>
                                    <p className="text-gray-500" style={{ overflowWrap: 'anywhere' }}>{prompt.description}</p>
                                    {
                                        (session.user.id == prompt.ownerId) &&
                                        <div className="flex items-center pt-2 gap-x-5 gap-y-1 flex-wrap">
                                            <button onClick={() => {
                                                setIsAddingPrompt(false);
                                                setIsUpdatingPrompt(true);
                                                setPromptOnUpdating(prompt);
                                            }} className="text-sm text-blue-500">Edit</button>
                                            <button className="text-sm text-red-500 hover:undefined" onClick={() => {
                                                onDeletePrompt(prompt._id);
                                            }}>
                                                Delete
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className="text-right flex-shrink-0 flex items-center justify-center gap-2">
                                    <button onClick={() => { onUsePromptHandler(prompt); }}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap">
                                        ? Use
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div >
    )
}

export default MyPromptList;
