import * as React from 'react'
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IconAnthropic, IconEdit, IconGPT, IconGPT4, IconGemini, IconGrid, IconHaiku, IconRemove, IconThreeDots } from '@/components/ui/icons'
import { Switch } from '@/components/ui/switch'
import { GPTModel } from '@/lib/types';
import { cn } from '@/lib/utils'

import GeminiIcon from '@/public/gemini.png'
import { getModels, updateModel, deleteModel } from '@/app/admin/models/action';
import { toast } from 'sonner';

export function ModelList({ setIsModelAdding, setSelectedModel }: React.ComponentProps<'div'> & {
  setIsModelAdding: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedModel: React.Dispatch<React.SetStateAction<GPTModel | null>>
}) {
  const [models, setModels] = React.useState<GPTModel[]>([]);
  const [updateFlag, setUpdateFlag] = React.useState(false);

  const fetchModels = async () => {
    try {
      const allModels = await getModels();
      setModels(allModels);
    } catch (err) {
      console.error('Error fetching models: ', err);
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const reorderedModels = Array.from(models);
    const [removed] = reorderedModels.splice(result.source.index, 1);
    reorderedModels.splice(result.destination.index, 0, removed);
    const target = reorderedModels[result.destination.index];
    const prevTarget = reorderedModels[result.destination.index - 1];
    const nextTarget = reorderedModels[result.destination.index + 1];
    if (!prevTarget) {
      console.log("No Prev Target");
      target.weight = (nextTarget?.weight ?? 0) / 2;
    } else if (!nextTarget) {
      console.log("No Next Target");
      target.weight = (prevTarget?.weight ?? 0) + 100;
    } else if (prevTarget?.weight !== undefined && nextTarget?.weight !== undefined) {
      target.weight = (prevTarget.weight + nextTarget.weight) / 2;
    }
    reorderedModels[result.destination.index] = target;
    setModels(reorderedModels);
    await updateModel(target);
  }

  const handleSwitchToggle = async (index: number) => {
    const updatedModels = models.map((model, i) =>
      i === index ? { ...model, isPinned: !model.isPinned } : model
    );
    setModels(updatedModels);
    await updateModel(updatedModels[index]);
    toast.success('Saved!', { duration: 2000 });
  };

  const handleDeleteModel = async (id: string) => {
    const res = await deleteModel(id);
    setUpdateFlag(!updateFlag);
  }

  React.useEffect(() => {
    fetchModels();
  }, []);

  React.useEffect(() => {
    const fetchModels = async () => {
      const models = await getModels();
      setModels(models);
    }

    fetchModels();
  }, [updateFlag])

  return <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="models">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef} className='mt-4 space-y-4'>
          {models.map((model, index) => (
            <Draggable key={model.name} draggableId={model.name} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <div className='flex items-center ring-inset ring-gray-300 dark:bg-zinc-800 dark:text-white bg-white rounded-md shadow border-gray-200 border !ring-0 !px-6 !py-4'>
                    <div className='min-w-0'>
                      <div className='flex items-center space-x-4'>
                        <div className={
                          cn(
                            'flex items-center justify-center shrink-0 text-white p-0.5 size-6 rounded-sm',
                            {
                              'bg-danger': model.name.startsWith('GPT-4'),
                              'bg-success': model.name.startsWith('GPT-3.5'),
                              'bg-warning': model.name.startsWith('Claude'),
                              'w-7 h-7': model.name.startsWith('Gemini')
                            }
                          )
                        }>
                          {
                            model?.modelId === 'gpt-4-turbo' ? <IconGPT4 /> :
                              model?.modelId === 'gpt-3.5-turbo' ? <IconGPT /> :
                                model?.modelId === 'claude-3-haiku-20240307' ? <IconHaiku /> :
                                  model?.modelId === 'models/gemini-pro' ? <IconGemini /> :
                                    <img src={model?.iconUrl} alt='icon' />
                          }
                          {/* {
                            model.name.startsWith('GPT')
                              ? <IconGPT />
                              : model.name.startsWith('Claude')
                                ? <IconAnthropic />
                                : <Image src={GeminiIcon.src} alt="Gemini Icon" width={28} height={28} />
                          } */}
                        </div>
                        <div className='flex items-center gap-x-4 gap-y-1 flex-wrap !mr-auto'>
                          <p className='font-medium'>{model.name}</p>
                          <p className='text-sm text-gray-500'>{model.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className='ml-auto flex items-center space-x-2'>
                      <Switch checked={model.isPinned} onCheckedChange={() => handleSwitchToggle(index)} />
                      {model?.isCustomModel === true &&
                        <div className="relative inline-block text-left" data-headlessui-state="">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="hover:bg-gray-100 rounded-full size-10 flex items-center justify-center" id="headlessui-menu-button-:r3:" type="button" aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
                                <IconThreeDots />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem className="flex-col items-start">
                                <button onClick={() => {
                                  setSelectedModel(model);
                                  setIsModelAdding(true);
                                }} className="text-gray-700 space-x-2 flex w-full items-center justify-start px-4 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                >
                                  <IconEdit />
                                  <span>Edit</span>
                                </button>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex-col items-start">
                                <button onClick={() => { handleDeleteModel(model?.id || '') }} className="text-gray-700 space-x-2 flex w-full items-center justify-start px-3 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50">
                                  <IconRemove />
                                  <span>Remove</span>
                                </button>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>}
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
}