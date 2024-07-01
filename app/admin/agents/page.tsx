'use client'

import * as React from 'react'

import coderImage from '@/public/pro-coder.png'
import techImage from '@/public/technician.png'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconPlus } from '@/components/ui/icons'
import { Switch } from '@/components/ui/switch'
import { AgentLists } from '@/components/admin/agent-list'
import { AddingAgent } from '@/components/admin/adding-agent'
import { getAgents } from '@/app/admin/agents/actions'


export default function IndexPage() {

  const [selectAgent, setSelectAgent] = React.useState({});
  const [agents, setAgents] = React.useState<any>([]);
  const [search, setSearch] = React.useState('');
  const [isAgentAdding, setIsAgentAdding] = React.useState(false);

  const fetchAgents = async () => {
    try {
      const allAgents = await getAgents();
      setAgents(allAgents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  React.useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className='mx-auto duration-300 max-w-3xl'>
      {/* <div className='my-10 space-y-4'>
        <div className='mt-2'>
          <div className="flex items-center justify-start">
            <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
              <Switch
                name='assgnedModelParam'
              // checked={agent.assgnedModelParam}
              // onCheckedChange={(checked: boolean) => setAgent({ ...agent, assgnedModelParam: checked })}
              />
              <div className='w-full'>
                <div className='ml-2'>Show build-in AI agents</div>
                <div className='ml-2 text-gray-500 text-xs w-full'>
                  e.g. Specialized Assistants, Language Learning, Fictional Characters.
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className='mt-2'>
          <div className="flex items-center justify-start">
            <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
              <Switch
                name='assgnedModelParam'
              // checked={agent.assgnedModelParam}
              // onCheckedChange={(checked: boolean) => setAgent({ ...agent, assgnedModelParam: checked })}
              />
              <div className='w-full'>
                <div className='ml-2'>Only show AI agents for logged in users</div>
                <div className='ml-2 text-gray-500 text-xs w-full'>
                  If enabled, only logged in users will be able to see AI agents (built-in AI agents are still shown for everyone).
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className='mt-2'>
          <div className="flex items-center justify-start">
            <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
              <Switch
                name='assgnedModelParam'
              // checked={agent.assgnedModelParam}
              // onCheckedChange={(checked: boolean) => setAgent({ ...agent, assgnedModelParam: checked })}
              />
              <div className='w-full'>
                <div className='ml-2'>Allow users to add their own AI agents</div>
                <div className='ml-2 text-gray-500 text-xs w-full'>
                  AI agents added by users will only be visible to them.
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className='mt-2'>
          <div className="flex items-center justify-start">
            <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
              <Switch
                name='assgnedModelParam'
              // checked={agent.assgnedModelParam}
              // onCheckedChange={(checked: boolean) => setAgent({ ...agent, assgnedModelParam: checked })}
              />
              <div className='w-full'>
                <div className='ml-2'>Require user to select an AI agent before chatting</div>
                <div className='ml-2 text-gray-500 text-xs w-full'>
                  If enabled, chat will be disabled until the user selects an AI agent.
                </div>
              </div>
            </label>
          </div>
        </div>
        <div className='mt-2'>
          <div className="flex items-center justify-start">
            <label className='inline-flex items-center justify-start flex-shrink-0 w-full'>
              <Switch
                name='assgnedModelParam'
              // checked={agent.assgnedModelParam}
              // onCheckedChange={(checked: boolean) => setAgent({ ...agent, assgnedModelParam: checked })}
              />
              <div className='w-full'>
                <div className='ml-2'>Force a default AI agent for all chats</div>
                <div className='ml-2 text-gray-500 text-xs w-full'>
                  Affect system-wide, users will not be able to change or select a different AI agent.
                </div>
              </div>
            </label>
          </div>
        </div>
      </div> */}
      <div className='my-4 grid grid-cols-[1fr_auto] items-center justify-center gap-2'>
        <Input
          name='search'
          placeholder='Search your characters'
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          className='w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800 bg-white text-black'
        />
        <Button
          variant='default'
          className='text-blue-500 hover:underline inline-flex justify-center items-center font-semibold space-x-1 shrink-0 truncate py-2 px-2'
        >
          <IconPlus />
          <span onClick={() => setIsAgentAdding(true)}>Create AI Agent</span>
        </Button>
      </div>
      {
        isAgentAdding
          ? <AddingAgent selectAgent={selectAgent} backToMain={() => {
            setIsAgentAdding(false);
            setSelectAgent({});
          }} />
          : <AgentLists search={search} agents={agents} setIsAgentAdding={setIsAgentAdding} selectAgent={selectAgent} setSelectAgent={setSelectAgent} />
      }
    </div>
  )
}