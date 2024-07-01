'use client'

import { useEffect, useState } from "react"
import { ApiKey } from "@/lib/types"

import { Button } from "@/components/ui/button"
import { IconAnthropic, IconCheck, IconGPT, IconGemini, IconSpinner } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { checkApiKey, saveApiKey } from "@/actions/api_key"

interface KeyItemProps {
    apiKey: ApiKey
}
const KeyItem = ({ ...props }: KeyItemProps) => {
    const { apiKey } = props;
    const [key, setKey] = useState(props.apiKey.key);

    const [isSaving, setIsSaving] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const saveKey = async () => {
        try {
            if (key.length == 0) return;
            setIsSaving(true);
            const res = await saveApiKey(apiKey._id || '', key);
            if (res.status == 'success') {
                toast.success('Saved Successfully!')
            }
            else toast.error(res.msg);
        }
        catch (err: any) {
            toast.error('Unexpected Error!');
        }
        setIsSaving(false);
    }

    const checkKey = async () => {
        try {
            setIsChecking(true);
            const res = await checkApiKey(apiKey.name);
            if (res.status == 'success') {
                toast.success('Api Key is working!');
            }
            else {
                toast.success('Api Key is not working!');
            }
        }
        catch (err: any) {
            toast.error('Unexpected Error!');
        }
        setIsChecking(false);
    }
    return (
        <div>
            <div className="my-2">
                <div className="flex items-center justify-between my-2">
                    <div className="text-sm font-semibold">
                        <span>{apiKey.name} API Key: </span>
                        {/* <Link href={apiKey.link} className="text-blue-500 hover:underline">(Get API key here)</Link> */}
                    </div>
                </div>
                <div className="flex flex-wrap md:flex-nowrap items-center gap-2">
                    <div className={cn("flex items-center justify-center flex-shrink-0 text-white p-0.5 w-6 h-6 rounded-sm",
                        { 'bg-danger': apiKey.name === 'OpenAI' },
                        { 'bg-warning': apiKey.name === 'Anthropic' }
                    )}>
                        {
                            apiKey.name === 'OpenAI' ? <IconGPT /> : apiKey.name === 'Anthropic' ? <IconAnthropic /> :
                                apiKey.name === 'Google Gemini' ? <IconGemini /> : <></>
                        }
                    </div>
                    <Input
                        name={apiKey.name}
                        placeholder={apiKey.placeholder}
                        onChange={(e: any) => { setKey(e.target.value); }}
                        value={key}
                        className="grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-700 bg-white text-black"
                    />
                    <div className="flex items-center gap-2 ml-auto">
                        <Button
                            variant='default'
                            onClick={() => { saveKey(); }}
                            disabled={apiKey.key === '' || isSaving}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 space-x-1 disabled:bg-gray-400 flex-shrink-0"
                        >
                            {isSaving ? <IconSpinner /> : <IconCheck className="text-white" />}
                            <span>Save</span>
                        </Button>
                    </div>
                </div>
            </div>
            <Button
                variant='default'
                disabled={key === '' || isChecking}
                onClick={() => { checkKey(); }}
                className='mt-2 space-x-1 inline-flex items-center text-sm font-medium rounded-md text-blue-600 hover:text-blue-700 focus:outline-none focus-visible:underline disabled:cursor-default disabled:opacity-50 transition-colors whitespace-nowrap gap-1'>
                {isChecking ? <IconSpinner /> : <></>}
                <span>{isChecking ? 'Checking API Key' : 'Check API Key'}</span>
            </Button>
        </div>
    )
}

export default KeyItem;