
import { usePromptPanelStore } from "@/lib/store";
import { Prompt } from "@/lib/types"

export default function PromptCard({ prompt, onDeleteHandler }: {
    prompt: Prompt
    onDeleteHandler: (prompt: Prompt) => void
}) {

    const { setIsUpdatingPrompt, setIsAddingPrompt, setPromptOnUpdating } = usePromptPanelStore();
    return (
        <div className="p-4 border bg-white border-gray-200 dark:border-gray-600 rounded shadow-sm mb-4 flex justify-between space-x-2 gap-3">
            <div className="w-full">
                <div className="flex items-center justify-start gap-2">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {prompt.title}
                    </h3>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <div className="overflow-hidden">
                        <p className="text-gray-500" style={{ overflowWrap: 'anywhere' }}>
                            {prompt.description}
                        </p>
                        <div className="flex items-center mt-1 gap-x-4 gap-y-1 flex-wrap">
                            <button className="text-xs text-blue-500" onClick={() => {
                                setPromptOnUpdating(prompt);
                                setIsUpdatingPrompt(true);
                                setIsAddingPrompt(false);
                            }}>
                                Edit
                            </button>
                            <button className="text-xs text-red-500 hover:undefined" onClick={() => {
                                onDeleteHandler(prompt);
                            }}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
