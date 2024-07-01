
import { useEffect, useState } from 'react'
// import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
// import { IconCardView, IconClose, IconListView } from '@/components/ui/icons'
import { AgentViewDialog } from '@/components/chat/agent/agent-view-dialog'
import { AgentDetail } from '@/components/chat/agent/agent-detail'

import LogoIcon from '@/public/logo.png'
// import CoderIcon from '@/public/pro-coder.png'
// import TechnicianIcon from '@/public/technician.png'

import { getAgents } from '@/app/admin/agents/actions';
import AgentList from './agent-list'
import useStore from '@/lib/store'

type ViewMode = 'list-mode' | 'card-mode';



export function AgentPanel() {

  const { selectedAgent } = useStore();
  const [agents, setAgents] = useState<any>([]);
  const [openDlg, setOpenDlg] = useState(false);

  const fetchAgents = async () => {
    try {
      const agents = await getAgents();
      setAgents(agents);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div>
      {!selectedAgent &&
        <div className='py-4 relative'>
          <div className='flex items-center justify-center my-20'>
            <div>
              <div className='flex items-center justify-center mb-4'>
                <Button className='cursor-default px-3 py-1 h-auto bg-green-500 text-white text-xs font-medium rounded-full transition-colors hover:bg-green-400 active:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 dark:active:bg-green-800'>
                  ✨ GPT-4o is available!
                </Button>
              </div>
              <div className='flex flex-col items-center justify-center space-x-2'>
                <img src={'https://impactmindai435-res.cloudinary.com/image/upload/w_1000,ar_16:9,c_fill,g_auto,f_auto/v1717946375/impactchat/ImpactChat-Cover101_rwpkdn.webp'} alt="TypingMind" className='rounded-lg w-60' />
                <div className='font-semibold text-4xl sm:text-5xl text-black dark:text-white'>
                  Impact
                  <span className='text-blue-500'>Chat</span>
                </div>
              </div>
            </div>
          </div>
          <AgentList agents={agents} openDlg={setOpenDlg} />
        </div>}

      {selectedAgent && <AgentDetail agent={selectedAgent} setOpenDlg={setOpenDlg} />}
      <AgentViewDialog open={openDlg} setOpen={setOpenDlg} agents={agents} />
    </div>
  )
}
