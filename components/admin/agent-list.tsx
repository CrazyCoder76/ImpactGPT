import * as React from 'react'

import { Agent } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'

import { deleteAgent } from '@/app/admin/agents/actions'

export function AgentLists({ agents, setIsAgentAdding, selectAgent, setSelectAgent, search }: React.ComponentProps<'div'> & {
  agents: Agent[],
  setIsAgentAdding: React.Dispatch<React.SetStateAction<boolean>>;
  selectAgent: {},
  setSelectAgent: React.Dispatch<React.SetStateAction<{}>>,
  search: string
}) {
  const [status, setStatus] = React.useState(0);
  const [pending, setPending] = React.useState(0);
  const [selectedItem, setSelectedItem] = React.useState(0);

  const handleEdit = (agent: any) => {
    setSelectAgent(agent);
    setIsAgentAdding(true);
  }

  const handleDelete = async (agent: any, index: number) => {
    setSelectedItem(index);
    if (status === 0) {
      setStatus(1);
    }
    if (status === 1) {
      setPending(1);
      const res = await deleteAgent(agent.id);
      if (res.status === 200) {
        window.location.reload();
      }
    }
  }

  const filteredAgents = agents.filter(agent =>
    agent.title.toLowerCase().includes(search.toLowerCase()) ||
    agent.description.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    if (status === 1) {
      setTimeout(() => {
        setStatus(0);
      }, 3000);
    }
  }, [status])

  return <div>
    {filteredAgents.map((agent, index) =>
      <div key={agent.title} className="p-4 border border-gray-200 dark:border-gray-600 rounded shadow-sm mb-4 flex items-start justify-start space-x-2 gap-3 bg-white">
        <img src={agent.pictureUrl} className='error-fallback-gray flex-shrink-0 object-cover w-20 h-20 rounded-lg' />
        <div className='w-full'>
          <div className='flex items-center justify-start gap-2'>
            <h3 className='text-lg font-bold text-gray-800 dark:text-white'>{agent.title}</h3>
          </div>
          <div className='flex items-center justify-between gap-2'>
            <div>
              <p className='text-gray-500 whitespace-pre-line'>{agent.description}</p>
              <div className='flex items-center mt-2 gap-x-4 gap-y-1 flex-wrap'>
                <Button variant='default' className='text-base text-blue-500 hover:underline' onClick={() => handleEdit(agent)}>Edit</Button>
                <Button variant='default' className='text-base text-red-500 hover:underline flex items-center space-x-1' onClick={() => { handleDelete(agent, index) }}>
                  <span>{pending === 1 ? <IconSpinner /> : status === 1 && selectedItem === index ? "Sure?" : "Delete"}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>)}
  </div>
}