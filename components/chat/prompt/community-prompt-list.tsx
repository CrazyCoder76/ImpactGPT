"use client"

import { Prompt } from '@/lib/types';
import { usePromptPanelStore } from '@/lib/store';

const CommunityPromptList = ({ prompts }: { prompts: Prompt[] }) => {

    const { onUsePromptHandler } = usePromptPanelStore();
    return (
        <div>
            {
                prompts && prompts.map((prompt: Prompt) => (
                    <div key={prompt?._id} className="p-4 border border-gray-200 dark:border-gray-600 rounded shadow-sm mb-4 flex items-center justify-between space-x-2 gap-3">
                        <div className="w-full">
                            <div className="flex items-center justify-between gap-2 mt-1">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-start gap-2">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{prompt.title}</h3>
                                    </div>
                                    <p className="text-gray-500" style={{ overflowWrap: 'anywhere' }}>{prompt.description}</p>
                                </div>
                                <div className="text-right flex-shrink-0 flex items-center justify-center gap-2">
                                    <button onClick={() => { onUsePromptHandler(prompt); }}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap">
                                        → Use
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default CommunityPromptList;
