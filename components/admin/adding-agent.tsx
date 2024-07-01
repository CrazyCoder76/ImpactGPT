import * as React from 'react'
import Link from 'next/link'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { IconSpinner } from '@/components/ui/icons'

import { addAgent, updateAgent } from '@/app/admin/agents/actions'

type AddingAgent = {
  title: string
  isPinned: boolean
  description: string
  pictureUrl: string
  gptModel: string
  instruction: string
  overrideInstruction: boolean
  welcomeMsg: string
  starters: string[]
  assignedModel: boolean
  assignedPlugin: boolean
  assignedTSSetting: boolean
  assgnedModelParam: boolean
  pending: boolean
  error: boolean
}

const initialAgent: AddingAgent = {
  title: '',
  isPinned: false,
  description: '',
  pictureUrl: '',
  gptModel: 'gpt-4o',
  instruction: '',
  overrideInstruction: false,
  welcomeMsg: '',
  starters: [],
  assignedModel: false,
  assignedPlugin: false,
  assignedTSSetting: false,
  assgnedModelParam: false,
  pending: false,
  error: false
}

type GPTModel = {
  name: string
  value: string
}

const gptModels: GPTModel[] = [
  // {
  //   name: 'GPT-4o',
  //   value: 'gpt-4o'
  // },
  // {
  //   name: 'GPT-4',
  //   value: 'gpt-4'
  // },
  {
    name: 'GPT-4 Turbo',
    value: 'gpt-4-turbo'
  },
  // {
  //   name: 'GPT-4 32K',
  //   value: 'gpt-4-32k'
  // },
  {
    name: 'GPT-3.5',
    value: 'gpt-3.5-turbo'
  },
  {
    name: 'Gemini 1.5 Flash',
    value: 'gemini-1.5-flash'
  },
  {
    name: 'Claude 3 Haiku',
    value: 'claude-3-haiku'
  },
  // {
  //   name: 'GPT-3.5 16K',
  //   value: 'gpt-3.5-turbo-16k'
  // }
]

type Visibility = {
  name: string
  value: number
}

const visibilityValues: Visibility[] = [
  {
    name: 'Visible to all users',
    value: 0
  },
  {
    name: 'Visible only to users with tags',
    value: 1
  },
  {
    name: 'Visible to all users except users with tags',
    value: 2
  },
]

type TrainingData = {
  name: string
  value: number
}

const trainingDatas: TrainingData[] = [
  {
    name: 'Allow access to all training data',
    value: 0
  },
  {
    name: 'Not allow to access any training data',
    value: 1
  },
  {
    name: 'Allow access only training data with tags',
    value: 2
  },
]

export function AddingAgent({ backToMain, selectAgent }: React.ComponentProps<'div'> & {
  backToMain: () => void,
  selectAgent: Partial<AddingAgent>
}) {
  const [agent, setAgent] = React.useState<AddingAgent>(initialAgent)

  const onAgentChange = (e: React.ChangeEvent<any>) => {
    setAgent({ ...agent, [e.target.name]: e.target.value })
  }

  const addStarter = () => {
    setAgent({
      ...agent,
      starters: [...agent.starters, '']
    })
  }

  const handleStarterChange = (index: number, newText: string) => {
    const newStarters = [...agent.starters];
    newStarters[index] = newText;
    setAgent({
      ...agent,
      starters: newStarters
    })
  }

  const removeStarter = (index: number) => {
    setAgent({
      ...agent,
      starters: agent.starters.filter((_, i) => i !== index)
    })
  }

  const handleAddChange = async () => {
    if (agent.title.trim() === '' || agent.instruction.trim() === '') {
      setAgent({ ...agent, error: true, pending: false })
    } else {
      setAgent({ ...agent, pending: true })
      if (Object.keys(selectAgent).length === 0) {
        const res = await addAgent(agent);
        if (res?.status === 200) {
          setAgent({ ...agent, error: false, pending: false })
          window.location.reload();
        }
      } else {
        const res = await updateAgent(agent);
        if (res?.status === 200) {
          setAgent({ ...agent, error: false, pending: false })
          window.location.reload()
        }
      }
    }
  }

  React.useEffect(() => {
    if (Object.keys(selectAgent).length !== 0) {
      setAgent({ ...initialAgent, ...selectAgent })
    }
  }, [selectAgent])

  return <div className='my-4'>
    <div>
      <div className='font-semibold my-1'>Title*:</div>
      <Input
        name='title'
        value={agent.title}
        placeholder='E.g., Life Coach'
        onChange={onAgentChange}
        className='w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700 bg-white text-black'
      />
      <div className='mt-2'>
        <div className="flex items-center justify-start">
          <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
            <Switch
              name='isPinned'
              checked={agent.isPinned}
              onCheckedChange={(checked: boolean) => setAgent({ ...agent, isPinned: checked })}
            />
            <div className='w-full'>
              <div className='ml-2'>Pin this AI agent on the main page</div>
              <div className='ml-2'></div>
            </div>
          </label>
        </div>
      </div>
      <div className='mb-1 mt-3'>
        <div className='font-semibold my-1'>Description:</div>
        <div className='text-xs text-gray-500'>Explain what the AI agent does and how to use it. Will be shown to the user.</div>
      </div>
      <Textarea
        name='description'
        value={agent.description}
        placeholder='E.g., A life coach who can help you set and achieve personal and professional goals.'
        onChange={onAgentChange}
        className='w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700 bg-white text-black'
      />
      <div className='mb-1 mt-4'>
        <div className='flex items-start justify-start gap-2 w-full'>
          <div className='class="flex-shrink-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center w-20 h-20 rounded-lg "'>
            {!agent.pictureUrl ? <svg stroke='currentColor' fill='currentColor' strokeWidth={0} viewBox='0 0 512 512' className='text-gray-500 w-8 h-8' width="1em" height="1em" xmlns='http://www.w3.org/2000/svg'>
              <path d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm128 32h-55.1c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16H128C57.3 320 0 377.3 0 448v16c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-16c0-70.7-57.3-128-128-128z"></path>
            </svg> : <img src={agent.pictureUrl} alt='' />}
          </div>
          <div className='w-full'>
            <div>
              <span className='font-semibold'>Profile Picture URL:</span>
              <div className='text-xs text-gray-500'>Profile picture for the AI agent. Will be displayed along with the AI agent&apos;s messages.</div>
            </div>
            <Input
              name='pictureUrl'
              value={agent.pictureUrl}
              placeholder='https://'
              onChange={onAgentChange}
              className='w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700 bg-white text-black'
            />
          </div>
        </div>
      </div>
      <fieldset className='mt-5 flex items-center flex-wrap space-x-1 [&>*]:my-0.5 disabled:cursor-default disabled:opacity-50' disabled={agent.title === ''}>
        <Button className='space-x-1 inline-flex items-center text-sm font-medium rounded-md text-blue-600 hover:text-blue-700 focus:outline-none focus:underline transition-colors whitespace-nowrap gap-1'>
          Auto fill content with AI
        </Button>
        <span className="text-sm font-medium">using model:</span>
        <select
          onChange={(e) => { setAgent({ ...agent, gptModel: e.target.value }) }}
          className="py-1 pl-1.5 w-fit pr-6 block rounded-md border-0 text-gray-900 dark:text-white dark:bg-zinc-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
        >
          {gptModels.map((model) => (
            <option key={model.value} value={model.value}>{model.name}</option>
          ))}
        </select>
      </fieldset>
      <div className='mb-1 mt-4'>
        <span className='font-semibold'>System Instruction (for the AI agent)*:</span>
        <div className='text-xs text-gray-500'>This will be used as the system instruction for the AI agent.</div>
        <div className='text-xs text-orange-500'>Your users will not see this instruction.</div>
      </div>
      <Textarea
        name='instruction'
        value={agent.instruction}
        placeholder='E.g., You are a life coach, you help the user identify and achieve their goals, motivate them, and provide support and encouragement.'
        onChange={onAgentChange}
        className='w-full min-h-[130px] border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700 bg-white text-black'>
      </Textarea>
      <div className='mt-2'>
        <div className="flex items-center justify-start">
          <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
            <Switch
              name='overrideInstruction'
              checked={agent.overrideInstruction}
              onCheckedChange={(checked: boolean) => setAgent({ ...agent, overrideInstruction: checked })}
            />
            <div className='w-full'>
              <div className='ml-2'>Override system instructions</div>
              <div className='ml-2 text-gray-500 text-xs w-full'>
                By default, the AI agent&apos;s instruction will be appended to the global default system instruction (set in Training Data ? Global System Instruction). Check this box if you want to skip the Global System Instruction for this AI agent.
              </div>
            </div>
          </label>
        </div>
      </div>
      {/* <div className='mb-1 mt-4'>
        <span className='font-semibold'>Dynamic Context via API:</span>
        <div className='text-xs text-gray-500'>Retrieve content from an API and inject into the system prompt. This can be used to add live information to the AI or implement Retrieval-Augmented Generation (RAG) from your own data sources (e.g., vector store database).
          <a target='_blank' className='text-blue-500 font-semibold hover:underline' href='/guides/dynamic-context'>(Learn more)</a>
        </div>
        <div className='text-xs text-orange-500'>Your users will not see the endpoints and the content of the Dynamic Context.</div>
      </div>
      <div className='mb-1 mt-2'>
        <Button className='text-blue-500 font-semibold flex items-center justify-center gap-1 hover:underline'>
          <svg stroke='currentColor' fill='currentColor' strokeWidth={0} viewBox='0 0 448 512' className='w-4 h-4' width="1em" height="1em" xmlns='https://www.w3.org/2000/svg'>
            <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
          </svg>
          <span>Add Endpoint</span>
        </Button>
      </div> */}
      <div className='mb-1 mt-4'>
        <span className='font-semibold'>Welcome message:</span>
        <div className='text-xs text-gray-500'>The first message to send to the user when start a new chat.</div>
      </div>
      <Textarea
        name='welcomeMsg'
        value={agent.welcomeMsg}
        placeholder="Hello, I' m a life coach. How can I help you today?"
        onChange={onAgentChange}
        className='w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700 bg-white text-black'
      />
      <div>
        <div className='mb-1 mt-4'>
          <span className='font-semibold'>Conversation Starters:</span>
          <div className='text-xs text-gray-500'>Suggest some first messages for the user to select from in the beginning of the conversation.</div>
        </div>
        <div className='space-y-2'>
          {
            agent.starters.map((starter, index) => (
              <ConversationStarterField key={index}
                starter={starter}
                handleStarterChange={(newText) => handleStarterChange(index, newText)}
                removeStarter={() => { removeStarter(index) }} />
            ))
          }
        </div>
        <div className='mb-1 mt-2'>
          <Button className='text-blue-500 font-semibold flex items-center justify-center gap-1 hover:underline' onClick={addStarter}>
            <svg stroke='currentColor' fill='currentColor' strokeWidth={0} viewBox='0 0 448 512' className='size-4' width="1em" height="1em" xmlns='https://www.w3.org/2000/svg'>
              <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
            </svg>
            <span>Add Conversation Starters</span>
          </Button>
        </div>
      </div>
      {/* <div>
        <div className='font-semibold mb-1 mt-4'>Visibility:</div>
        <select
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700"
        >
          {visibilityValues.map((visibility) => (
            <option key={visibility.value} value={visibility.value}>{visibility.name}</option>
          ))}
        </select>
      </div>
      <div>
        <div className='font-semibold mb-1 mt-4'>Accessbility of Training Data:</div>
        <select
          className="w-full border border-gray-300 rounded-md shadow-sm py-2 pl-3 pr-10 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700"
        >
          {trainingDatas.map((data) => (
            <option key={data.value} value={data.value}>{data.name}</option>
          ))}
        </select>
      </div>
      <div>
        <div className='mb-1 mt-4'>
          <div className='font-semibold'>Training Examples:</div>
          <div className='text-xs text-gray-500'>Training examples help the AI agent learn how to respond to users.</div>
        </div>
        <div className='mt-2 mb-4'>
          <Button className='text-blue-500 font-semibold flex items-center justify-center gap-1 hover:underline'>
            <svg stroke='currentColor' fill='currentColor' strokeWidth={0} viewBox='0 0 448 512' className='w-4 h-4' width="1em" height="1em" xmlns='https://www.w3.org/2000/svg'>
              <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
            </svg>
            <span>Add Training Examples</span>
          </Button>
          <div className='text-xs text-orange-500'>Your users will not see these training examples.</div>
        </div>
      </div>
      <div>
        <div className='mb-1 mt-4'>
          <span className='font-semibold'>Assigned Model:</span>
        </div>
        <div className='mt-2'>
          <div className="flex items-center justify-start">
            <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
              <Switch
                name='assignedModel'
                checked={agent.assignedModel}
                onCheckedChange={(checked: boolean) => setAgent({ ...agent, assignedModel: checked })}
              />
              <div className='w-full'>
                <div className='ml-2'>Assign a specific model to this AI agent</div>
                <div className='ml-2 text-gray-500 text-xs w-full'>
                  Users can&apos;t change the model when using this AI agent.
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div>
        <div className='mb-1 mt-4'>
          <span className='font-semibold'>Assigned Plugins:</span>
        </div>
        <div className='mt-2'>
          <div className="flex items-center justify-start">
            <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
              <Switch
                name='assignedPlugin'
                checked={agent.assignedPlugin}
                onCheckedChange={(checked: boolean) => setAgent({ ...agent, assignedPlugin: checked })}
              />
              <div className='w-full'>
                <div className='ml-2'>Assign plugins for this AI agent</div>
                <div className='ml-2 text-gray-500 text-xs w-full'>
                  Users cant change the plugins when using this AI agent.
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div>
        <div className='mb-1 mt-4'>
          <span className='font-semibold'>Assigned Text-to-Speech Settings:</span>
        </div>
        <div className='mt-2'>
          <div className="flex items-center justify-start">
            <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
              <Switch
                name='assignedTSSetting'
                checked={agent.assignedTSSetting}
                onCheckedChange={(checked: boolean) => setAgent({ ...agent, assignedTSSetting: checked })}
              />
              <div className='w-full'>
                <div className='ml-2'>Assign text-to-speech settings for this AI agent</div>
              </div>
            </label>
          </div>
        </div>
      </div>
      <div>
        <div className='mb-1 mt-4'>
          <span className='font-semibold'>Assigned Advanced Model Parameters:</span>
        </div>
        <div className='mt-2'>
          <div className="flex items-center justify-start">
            <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
              <Switch
                name='assgnedModelParam'
                checked={agent.assgnedModelParam}
                onCheckedChange={(checked: boolean) => setAgent({ ...agent, assgnedModelParam: checked })}
              />
              <div className='w-full'>
                <div className='ml-2'>Assign advanced model parameters for this AI agent</div>
              </div>
            </label>
          </div>
        </div>
      </div> */}
      {agent.error && <div className='my-2'>
        <span className='text-sm text-red-500'>Title and instruction cannot be empty!</span>
      </div>}
      <div className='text-center my-4'>
        <Button className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap gap-1' onClick={handleAddChange}>
          {agent.pending ? <IconSpinner /> : <svg stroke='currentColor' fill='currentColor' strokeWidth={0} viewBox='0 0 1024 1024' className='w-4 w-4' width="1em" height="1em" xmlns='http://www.w3.org/2000/svg'>
            <path d='M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z'></path>
          </svg>}
          <span>Save</span>
        </Button>
        <Button className='text-black dark:text-white transition font-bold py-2 px-4 rounded inline-flex space-x-1 justify-center items-center' onClick={() => backToMain()}>
          Cancel
        </Button>
      </div>
    </div>
  </div >
}

const ConversationStarterField = ({ starter, handleStarterChange, removeStarter }: React.ComponentProps<'div'> & {
  starter: string,
  handleStarterChange: (nexText: string) => void
  removeStarter: () => void
}) => {
  return (
    <div className='flex items-center justify-between gap-2'>
      <Input
        value={starter}
        onChange={(e) => { handleStarterChange(e.target.value) }}
        placeholder='E.g., Hello assistant, what can you help me with?'
        className='w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700 bg-white text-black'
      />
      <Button className='text-red-500 font-semibold hover:underline' onClick={removeStarter}>Remove</Button>
    </div>
  )
}