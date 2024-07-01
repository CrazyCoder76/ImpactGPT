

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IconCardView, IconClose, IconListView } from '@/components/ui/icons';

import { cn } from '@/lib/utils';
import { Agent } from '@/lib/types';
import { getAgents } from '@/app/admin/agents/actions';

import useStore from '@/lib/store';
type ViewMode = 'list-mode' | 'card-mode';


export default function AgentList({ agents, openDlg }: { agents: Agent[], openDlg: any }) {

    const [viewMode, setViewMode] = useState<ViewMode>('list-mode');
    const { setSelectedAgent } = useStore();

    return (
        <div className='my-10 max-w-2xl mx-auto'>
            <div className='px-4 flex items-center justify-center flex-col'>
                <div className='text-center font-medium text-gray-500 my-4 flex sm:items-center justify-between gap-2 w-full px-4'>
                    <div className='cursor-pointer group flex gap-2 sm:gap-4 items-center'>
                        <span className="whitespace-nowrap">Your AI Agents</span>
                        <div className='opacity-100 group-hover/root:opacity-100 sm:opacity-0 hover:bg-gray-100 group flex sm:justify-center rounded transition-colors w-fit dark:hover:bg-zinc-700'>
                            <Button
                                variant='ghost'
                                className={cn(
                                    'transition-colors dark:bg-zinc-700 dark:group-hover:bg-zinc-600 dark:text-gray-300 px-2 py-1 rounded h-full',
                                    { 'bg-gray-200 text-gray-800 group-hover:bg-gray-300': viewMode === 'list-mode' }
                                )}
                                onClick={() => setViewMode('list-mode')}
                            >
                                <IconListView />
                            </Button>
                            <Button variant='ghost' className={cn(
                                'px-2 py-1 rounded h-full',
                                { 'bg-gray-200 text-gray-800 group-hover:bg-gray-300': viewMode === 'card-mode' }
                            )} onClick={() => setViewMode('card-mode')}>
                                <IconCardView />
                            </Button>
                        </div>
                    </div>
                    <Button variant='ghost' className='rounded-lg p-1 h-auto text-sm text-blue-500 hover:text-blue-700 transition-colors flex items-center justify-center gap-1'
                        onClick={() => { openDlg(true); }}
                    >
                        <span>View All ({agents ? agents.length: 0})</span>
                    </Button>
                </div>
                <div className={cn(
                    'grid w-full',
                    { 'grid-cols-1 sm:grid-cols-2 gap-2 ': viewMode === 'list-mode' },
                    { 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2': viewMode === 'card-mode' }
                )}>
                    {
                        agents && agents.map((agent: Agent, index: number) =>
                            agent.isPinned && <div key={index} className='group/root flex flex-col gap-4 py-2 px-4 rounded-md cursor-pointer hover:bg-gray-100 transition-all dark:hover:border-zinc-600 dark:hover:bg-zinc-800 relative'
                                onClick={() => {
                                    setSelectedAgent(agent);
                                }}>
                                <Button variant='default' className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-black/50 text-white p-1 group-hover/root:opacity-100 opacity-0 items-center justify-center hover:bg-black-70 transition-all hidden sm:flex'>
                                    <IconClose />
                                </Button>
                                <div className={cn('flex items-center gap-4', { 'flex-col': viewMode === 'card-mode', 'justify-start': viewMode === 'list-mode' })}>
                                    <div className="flex-shrink-0">
                                        <img src={agent.pictureUrl} className={cn('error-fallback-gray flex-shrink-0 object-cover w-9 h-9 rounded-md', { 'h-28 w-28 rounded-lg': viewMode === 'card-mode' })} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className={cn("font-semibold text-sm", { 'sm:text-center': viewMode === 'card-mode' })}>{agent.title}</div>
                                        <div className="text-gray-500 line-clamp-2 text-xs">{agent.description}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}