import { SetStateAction, useEffect, useRef, useState } from "react";
import { Input } from '@/components/ui/input';
import { updateEmailSetting } from "@/app/admin/email-settings/action";
import { toast } from "sonner";
import { IconSpinner } from "../ui/icons";
import { useRouter } from 'next/navigation'

const TemplateItem = ({ name, description, code, expanded, setExpanded, subject, setSubject, body, setBody }: {
    name: string,
    description: string,
    code: boolean,
    expanded: boolean,
    setExpanded: React.Dispatch<SetStateAction<boolean>>
    subject: string,
    setSubject: React.Dispatch<SetStateAction<string>>,
    body: string,
    setBody: React.Dispatch<SetStateAction<string>>
}) => {
    const textareaRef = useRef(null);
    const router = useRouter();
    const [pending, setPending] = useState(false);

    useEffect(() => {
        const adjustTextareaHeight = () => {
            if (textareaRef.current) {
                const textarea = textareaRef.current as HTMLTextAreaElement;
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight + 10}px`;
            }
        };

        adjustTextareaHeight();

        const textarea = textareaRef.current as HTMLTextAreaElement | null;
        if (textarea) {
            textarea.addEventListener('input', adjustTextareaHeight);

            return () => {
                textarea.removeEventListener('input', adjustTextareaHeight);
            };
        }
    });

    return (
        <div className="bg-white rounded-md shadow border-gray-200 border w-full">
            <div className="px-6 py-4 flex items-center justify-between space-x-2 cursor-pointer" onClick={() => { setExpanded(!expanded) }}>
                <div>
                    <h2 className="text-xl font-semibold">
                        {name}
                    </h2>
                    <span className="mt-1">{description}</span>
                </div>
                <button className="ml-auto text-gray-500 rounded-sm hover:bg-gray-100 transition-all flex items-center justify-center shrink-0">
                    {!expanded ? (
                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 20 20" className="size-8" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    ) : (
                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 20 20" className="size-8" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"></path>
                        </svg>
                    )}
                </button>
            </div>
            {expanded && <>
                <form className="mt-4 px-6">
                    {code && <div>
                        <div>Use <code className="text-xs bg-gray-300 dark:bg-zinc-900 inline-block p-1">{'{{code}}'}</code> to indicate the code the system provided for users to login.</div>
                    </div>}
                    <h3 className="mt-4 text-base font-semibold">Subject</h3>
                    <Input
                        value={subject}
                        onChange={(e) => { setSubject(e.target.value) }}
                        placeholder='Subject'
                        className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm mt-3 ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 bg-white'
                    />
                    <h3 className='mt-4 text-base font-semibold'>Body</h3>
                    <textarea
                        ref={textareaRef}
                        value={body}
                        onChange={(e) => { setBody(e.target.value) }}
                        className='mt-2 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base leading-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out dark:bg-zinc-700'
                    >
                    </textarea>
                </form>
                <div className='my-6 text-center'>
                    <button
                        onClick={async () => {
                            setPending(true);
                            await updateEmailSetting({
                                name: name,
                                subject: subject,
                                body: body
                            });
                            toast.success("Saved", {
                                duration: 2000
                            });
                            router.refresh();
                            setPending(false);
                        }}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${pending ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:bg-gray-400 gap-2`}
                        disabled={pending}
                    >
                        {pending ? <IconSpinner /> : "→"} Save
                    </button>
                </div>
            </>}
        </div>
    )
}

export default TemplateItem;