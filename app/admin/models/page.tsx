'use client'

import * as React from 'react'
import { Switch } from "@/components/ui/switch"
import { Button } from '@/components/ui/button'
import { IconPlus } from '@/components/ui/icons'
import { ModelList } from '@/components/admin/model-list'
import { AddingModel } from '@/components/admin/adding-model'
import { GPTModel } from '@/lib/types'

export default function IndexPage() {
  // const [forceCheck, setForceCheck] = React.useState(false);
  const [isModelAdding, setIsModelAdding] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState<GPTModel | null>(null);

  return <div>
    {isModelAdding
      ? <AddingModel backToMain={() => setIsModelAdding(false)} selectedModel={selectedModel} />
      :
      <div className='mx-auto duration-300 max-w-3xl '>
        <div className="relative">
          {/* <h2 className="text-xl font-semibold mt-8 mb-2">Settings</h2> */}
          {/* <div className="bg-white rounded-md shadow border-gray-200 border w-full py-4 px-6">
            <div className="flex items-center justify-between space-x-4">
              <span className="flex grow flex-col">
                <span className="font-medium leading-6 text-gray-900 flex items-center space-x-2">
                  <span>Enforce Default Model</span>
                </span>
                <span className="text-sm text-gray-500">
                  Users won&apos;t be able to change the model when this setting is enabled
                </span>
                <div className="mt-4 flex items-center">
                  <span className="text-sm mr-4 text-gray-800">Force Default Model:</span>
                  <select
                    className="block w-fit rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 dark:text-white dark:bg-zinc-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                  >
                    {gptModels.map((model) => (
                      <option key={model.value} value={model.value}>{model.name}</option>
                    ))}
                  </select>
                </div>
              </span>
              <Switch checked={forceCheck} onCheckedChange={setForceCheck} />
            </div>
          </div> */}
          <div className='flex items-center justify-between gap-2 mt-8 mb-2'>
            <h2 className='text-xl font-semibold'>Models</h2>
            <Button variant='default' className='text-blue-500 hover:underline inline-flex justify-center items-center font-semibold space-x-1 shrink-0 truncate px-2'>
              <IconPlus />
              <span onClick={() => { setIsModelAdding(true); setSelectedModel(null); }}>Add Custom Model</span>
            </Button>
          </div>
          <div className='flex items-center space-x-1'>
            <p>Users only see these enabled models with your pre-configured order</p>
          </div>
          <ModelList setIsModelAdding={setIsModelAdding} setSelectedModel={setSelectedModel} />
        </div>
      </div>}
  </div>
}