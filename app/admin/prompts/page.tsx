'use client'

import * as React from 'react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import PromptCard from '@/components/admin/prompt/prompt-card';
import PromptForm from '@/components/admin/prompt/prompt-form';
import { IconAdd, IconDownload, IconExport, IconImport } from '@/components/ui/icons';

import { deletePromptById, getMyPrompts } from './actions';
import { Prompt } from '@/lib/types';
import { usePromptPanelStore } from '@/lib/store';



export default function Page() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [updateFlag, setUpdateFlag] = useState(false);

  const { isAddingPrompt, isUpdatingPrompt, setIsAddingPrompt, setIsUpdatingPrompt } = usePromptPanelStore();

  useEffect(() => {
    (async () => {
      setPrompts(await getMyPrompts());
    })();
  }, [updateFlag]);

  const onDeletePrompt = async (prompt: Prompt) => {
    const res = await deletePromptById(prompt._id);
    if (res.success == true) {
      setUpdateFlag((prevFlag) => !prevFlag);
    }
  }

  return (
    <div className='grow bg-gray-50  p-6 pb-20'>
      <div className='mx-auto duration-300 max-w-3xl '>
        <div>

          <div className="my-10 flex items-center gap-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap gap-1">
              <IconExport />
              <span>Export Prompts</span>
            </button>

            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap gap-1">
              <IconImport />
              <span>Import Prompts</span>
            </button>

            <span>
              <a className="text-blue-500 inline-flex items-center hover:underline cursor-pointer italic">
                <IconDownload />
                <span>Download sample file</span>
              </a>
            </span>
          </div>
        </div>
        <div>
          <div className='my-4 grid grid-cols-[1fr_auto] items-center justify-center gap-2'>
            <input type="text" readOnly placeholder="Search your prompts" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800" value="" />

            <button className="text-blue-500 hover:underline inline-flex justify-center items-center font-semibold space-x-1 shrink-0 truncate py-2 px-2"
              onClick={() => { setIsAddingPrompt(true); setIsUpdatingPrompt(false); }}>
              <IconAdd />
              <span>Add Prompt</span>
            </button>
          </div>

          <div>
            {
              isAddingPrompt ? <PromptForm params={{ mode: 'add', onUpdateHander: setUpdateFlag }} /> :
                isUpdatingPrompt ? <PromptForm params={{ mode: 'update', onUpdateHander: setUpdateFlag }} /> : <></>
            }
          </div>
          <div>
            {
              !isUpdatingPrompt &&
              prompts.map((prompt: Prompt, index: number) => <PromptCard onDeleteHandler={onDeletePrompt} prompt={prompt} key={index} />)
            }
          </div>
        </div>
      </div>
    </div >
  )
}