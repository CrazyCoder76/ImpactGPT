import { ForwardedRef, KeyboardEventHandler, RefObject, forwardRef } from "react"

export default forwardRef((
  { setShowModal, textAreaRef }: { setShowModal: Function, textAreaRef: RefObject<HTMLTextAreaElement> },
  ref: ForwardedRef<HTMLInputElement>
) => {
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      console.log(123);
      e.preventDefault();
    }
    if (e.key === 'Backspace' && e.currentTarget.value === '' || e.key === 'Escape') {
      setShowModal(false);
      textAreaRef.current?.focus();
    }
  }

  return (
    <div>
      <div className="relative px-4 pt-4">
        <input
          ref={ref}
          onKeyDown={onKeyDown}
          className="w-full border-2 border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
          placeholder="Search" id="headlessui-combobox-input-:rkj:" role="combobox" type="search" aria-expanded="false"
          aria-autocomplete="list" data-headlessui-state="" aria-controls="headlessui-combobox-options-:rkk:" />
      </div>
      <div className="h-60 mt-4 px-4 overflow-auto">
        <div className="w-full py-1 text-base focus:outline-none sm:text-sm" role="listbox"
          id="headlessui-combobox-options-:rkk:" data-headlessui-state="">
          <div className="relative text-center text-gray-500">
            Search prompts, characters, or chats...</div>
          <div className="mt-4 space-y-2">
            <div className="cursor-default select-none p-2 border border-gray-200 dark:border-gray-600 rounded-lg"
              id="headlessui-combobox-option-:rkl:" role="option" tabIndex={-1} aria-selected="false"
              data-headlessui-state="">
              <div className="text-black dark:text-white font-medium truncate w-full">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512"
                  className="inline-block mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm128 32h-55.1c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16H128C57.3 320 0 377.3 0 448v16c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-16c0-70.7-57.3-128-128-128z">

                  </path>
                </svg>
                <span>
                  Open AI Agents</span>
              </div>
            </div>
            <div className="cursor-default select-none p-2 border border-gray-200 dark:border-gray-600 rounded-lg"
              id="headlessui-combobox-option-:rkm:" role="option" tabIndex={-1} aria-selected="false"
              data-headlessui-state="">
              <div className="text-black dark:text-white font-medium truncate w-full">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512"
                  className="inline-block mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M448 360V24c0-13.3-10.7-24-24-24H96C43 0 0 43 0 96v320c0 53 43 96 96 96h328c13.3 0 24-10.7 24-24v-16c0-7.5-3.5-14.3-8.9-18.7-4.2-15.4-4.2-59.3 0-74.7 5.4-4.3 8.9-11.1 8.9-18.6zM128 134c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm0 64c0-3.3 2.7-6 6-6h212c3.3 0 6 2.7 6 6v20c0 3.3-2.7 6-6 6H134c-3.3 0-6-2.7-6-6v-20zm253.4 250H96c-17.7 0-32-14.3-32-32 0-17.6 14.4-32 32-32h285.4c-1.9 17.1-1.9 46.9 0 64z">

                  </path>
                </svg>
                <span>
                  Open Prompt Library</span>
              </div>
            </div>
            <div className="cursor-default select-none p-2 border border-gray-200 dark:border-gray-600 rounded-lg"
              id="headlessui-combobox-option-:rkn:" role="option" tabIndex={-1} aria-selected="false"
              data-headlessui-state="">
              <div className="text-black dark:text-white font-medium truncate w-full">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true"
                  className="inline-block mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clip-rule="evenodd">

                  </path>
                </svg>
                <span>
                  Open Model Settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})