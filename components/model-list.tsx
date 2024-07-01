'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils"
import { IconGPT, IconGPT4, IconChevronDown, IconChip, IconEye, IconPlugin, IconHaiku, IconGemini } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { useAIState } from 'ai/rsc'

import GeminiIcon from '@/public/gemini.png';
import ClaudeAiIcon from '@/public/claude-ai-icon.png';

import useStore from '@/lib/store';
import { GPTModel } from '@/lib/types';
import { getModels } from '@/app/admin/models/action';

type ModelListProps = React.ComponentProps<'div'> & {
	// modelList?: ModelItem[]
};


export function ModelList({ className }: ModelListProps) {
	const { currentModel, selectedChatId, setCurrentModel } = useStore();
	const [isDialogShow, setIsDialogShow] = React.useState<boolean>(false);
	const [selectedModel, setSelectedModel] = React.useState<GPTModel>();
	const [models, setModels] = React.useState<GPTModel[]>([])
	const router = useRouter();

	const fetchModels = async () => {
		try {
			const data = await getModels();
			setModels(data);
		}
		catch (err) {
			console.error('Error fetching models: ', err);
		}
	}

	const onModelChange = (model: GPTModel) => () => {
		setSelectedModel(model);
		setIsDialogShow(false);
		setCurrentModel(model);
		router.push('/');
	}

	React.useEffect(() => {
		fetchModels();
	}, []);

	React.useEffect(() => {
		if (models.length > 0) {
			setSelectedModel(models[0]);
			setCurrentModel(models[0]);
		}
	}, [models, setCurrentModel]);

	React.useEffect(() => {
		if (currentModel) {
			setSelectedModel(currentModel);
		}
	}, [currentModel]);
	// React.useEffect(() => {
	// 	const selected = orderedDummyModels.find((model) => model.value === currentModel);
	// 	if (selected) {
	// 		setSelectedModel(selected);
	// 	}
	// }, [selectedChatId, currentModel, orderedDummyModels]);

	return (
		true && (
			<div className={cn(className, 'sm:relative')}>
				<Button variant='ghost' className='p-2 inline-flex gap-2' onClick={() => setIsDialogShow(!isDialogShow)}>
					{
						selectedModel && <div className='shrink-0 text-white size-7 rounded-sm'>
							{
								selectedModel.modelId == 'gpt-4-turbo' ? <IconGPT4 /> :
									selectedModel.modelId == 'gpt-3.5-turbo' ? <IconGPT /> :
										selectedModel.modelId == 'claude-3-haiku-20240307' ? <IconHaiku /> :
											selectedModel.modelId == 'models/gemini-pro' ? <IconGemini /> :
												<img src={selectedModel.iconUrl} alt='icon' />
							}
						</div>
					}
					<span className='truncate max-w-[100px] sm:max-w-lg'>{selectedModel?.name}</span>
					<IconChevronDown />
				</Button >
				{
					isDialogShow && <div className='absolute inset-x-4 sm:right-auto sm:left-0 z-10 mt-2 sm:w-[280px] origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity/5 focus:outline-none p-2 opacity-100 scale-100'>
						<div className='text-sm font-normal pt-2 pb-4 px-3 flex items-start justify-start flex-col gap-2'>
							<div className='flex items-center justify-between w-full gap-2'>
								{
									selectedModel && <div className='flex items-center justify-start gap-2 font-semibold text-base w-full'>
										<div className='shrink-0 text-white size-10 rounded-sm'>
											{
												selectedModel.modelId == 'gpt-4-turbo' ? <IconGPT4 /> :
													selectedModel.modelId == 'gpt-3.5-turbo' ? <IconGPT /> :
														selectedModel.modelId == 'claude-3-haiku-20240307' ? <IconHaiku /> :
															selectedModel.modelId == 'models/gemini-pro' ? <IconGemini /> :
																<img src={selectedModel.iconUrl} alt='icon' />

											}
										</div>
										<span className='text-lg truncate max-w-[150px]'>{selectedModel?.name}</span>
									</div>

								}
							</div>
						</div>
						<div className='py-2 max-h-[300px] overflow-auto'>
							{
								models.map((model: GPTModel, index: number) =>
									<div
										key={index}
										className='flex items-center justify-between px-3 py-2.5 sm:py-2 sm:text-sm sm:font-normal text-base font-medium cursor-pointer'
										onClick={onModelChange(model)}
									>
										<div className='flex items-center justify-center gap-2'>
											<div className={cn(
												'shrink-0 text-white size-7 rounded-sm',
											)}>
												{
													model.modelId == 'gpt-4-turbo' ? <IconGPT4 /> :
														model.modelId == 'gpt-3.5-turbo' ? <IconGPT /> :
															model.modelId == 'claude-3-haiku-20240307' ? <IconHaiku /> :
																model.modelId == 'models/gemini-pro' ? <IconGemini /> :
																	<img src={model.iconUrl} alt='icon' />

												}
											</div>
											<span className='truncate max-w-[180px]'>{model.name}</span>
											{/* {model.isbrand && <span className='text-xs font-semibold text-green-500'>NEW</span>} */}
										</div>
									</div>)
							}
						</div>
					</div>
				}
			</div >
		)
	);
}