import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Agent } from '@/lib/types';

import useStore from '@/lib/store';

export function AgentDetail({ agent, setOpenDlg }: React.ComponentProps<'div'> & {
    agent: Agent,
    setOpenDlg: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const { setSelectedAgent } = useStore();
    return (
        <div className='transition-all relative max-w-3xl mx-auto '>
            <div className='pt-4 pb-4 relative'>
                <div className='p-4 flex items-center justify-center mb-8 max-w-md mx-auto'>
                    <div className='flex items-center justify-center gap-4 flex-col'>
                        <img src={agent.pictureUrl} className='error-fallback-gray flex-shrink-0 object-cover w-32 h-32 rounded-lg ' />
                        <div className='text-center'>
                            <div className='flex items-center justify-center gap-2 flex-wrap'>
                                <div className='text-xl font-semibold'>{agent.title}</div>
                                <div className='text-gray-500'>
                                    <svg stroke='currentColor' fill='currentColor' strokeWidth={0} viewBox='0 0 24 24' className='w-4 h-4' width="1em" height="1em" xmlns='http://www.w3.org/2000/svg'>
                                        <path d='M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z'></path>
                                    </svg>
                                </div>
                            </div>
                            <div className='text-sm'>
                                <Button className="text-blue-500 hover:underline font-semibold"
                                    onClick={() => { setSelectedAgent(undefined); }}
                                >
                                    Reset
                                </Button>
                                <span> · </span>
                                <Button className="text-blue-500 hover:underline font-semibold"
                                    onClick={() => { setOpenDlg(true) }}
                                >
                                    Change
                                </Button>
                            </div>
                            <div className='text-xs font-semibold my-2 flex items-center justify-center gap-2 flex-wrap'></div>
                            <div className='text-xs text-gray-500 dark:text-gray-400 whitespace-pre-line mt-2'>
                                {agent?.description}
                                {/* Help you write code without overexplain things too much using only its internal knowledge and treat like a professional developer */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='px-4 rounded-lg mb-2'>
                    <div className='pl-14 relative response-block scroll-mt-32 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 pb-2 pt-2 pr-2 group min-h-[52px]'>
                        <div className='absolute top-2 left-2'>
                            <Button className='relative w-9 h-9 flex'>
                                <img src={agent.pictureUrl} alt="" />
                            </Button>
                        </div>
                        <div className='w-full'>
                            <div className='prose max-w-full dark:prose-invert break-words prose-sm'>
                                <p>{agent.welcomeMsg}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}