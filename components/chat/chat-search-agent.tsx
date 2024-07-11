import { getAgents } from "@/app/admin/agents/actions";
import { Agent } from "@/lib/types";
import { ForwardedRef, KeyboardEventHandler, RefObject, forwardRef, useEffect, useMemo, useState } from "react"

export default forwardRef((
  { setShowModal, textAreaRef }: { setShowModal: Function, textAreaRef: RefObject<HTMLTextAreaElement> },
  ref: ForwardedRef<HTMLInputElement>
) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      console.log(123);
      e.preventDefault();
    }
    if (e.key === 'Backspace' && e.currentTarget.value === '' || e.key === 'Escape') {
      setShowModal(false);
      textAreaRef.current?.focus();
      e.preventDefault();
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const bias = e.key === 'ArrowDown' ? 1 : -1;
      invalidateSelection(bias);
    }
    else {
      invalidateSelection(0);
    }
  }

  function invalidateSelection(bias: number) {
    const pos = filteredAgents.findIndex(agent => agent.id === selected);
    let newPos = bias + pos;
    newPos = Math.min(Math.max(0, newPos), filteredAgents.length - 1);
    const newSel = filteredAgents[newPos]?.id
    setSelected(newSel);
    if (newSel) {
      const [e] = document.getElementsByClassName(`option_${newSel}`);
      e?.scrollIntoView();
      console.log(e);
    }
  }

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

  const filteredAgents = useMemo((): Agent[] => (
    agents.filter(agent => agent.title.includes(search) || agent.description.includes(search))
  ), [agents, search])

  return (
    <div>
      <div className="relative px-4 pt-4">
        <input ref={ref} onKeyDown={onKeyDown} className="w-full border-2 border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
          placeholder="Search AI agents..." id="headlessui-combobox-input-:rk3:" role="combobox" type="search" aria-expanded="false" aria-autocomplete="list" data-headlessui-state="" aria-controls="headlessui-combobox-options-:rk4:"
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="h-48 my-4 px-4 overflow-auto">
        <div className="w-full py-1 text-base focus:outline-none sm:text-sm" role="listbox" id="headlessui-combobox-options-:rk4:" data-headlessui-state="">
          <div className="space-y-2">
            {
              filteredAgents.map(agent => (
                <div key={agent.id} className={`option-${agent.id} cursor-default select-none p-2 border border-gray-200 dark:border-gray-600 rounded-lg
                  ${selected === agent.id ? "!bg-blue-600" : ""}`} role="option" tabIndex={-1} aria-selected="false" data-headlessui-state="">
                  <div className="flex items-center justify-start text-left gap-2">
                    <img src={agent.pictureUrl} className="error-fallback-gray flex-shrink-0 object-cover	w-5 h-5 rounded-sm" />
                    <div className={`flex-shrink-0 text-black dark:text-white font-medium truncate w-fit ${selected === agent.id ? "!text-white" : ""}`}>
                      {agent.title}
                    </div>
                    <div className={`text-xs text-gray-500 dark:text-gray-400 font-normal truncate w-full ${selected === agent.id ? "!text-gray-200" : ""}`}>
                      {agent.description}
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
})