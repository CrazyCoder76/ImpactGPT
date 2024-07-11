import { useEffect, useRef, useState } from "react"

export default function useRichKeysWithTextarea() {
  const [showSearchPromptModal, setShowSearchPromptModal] = useState(false);
  const [showSearchAgentModal, setShowSearchAgentModal] = useState(false);
  const refSearchPromptInput = useRef<HTMLInputElement>(null);
  const refSearchAgentInput = useRef<HTMLInputElement>(null);

  const onKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.currentTarget.value === '/') {
      setShowSearchPromptModal(true);
    }
    if (e.key === '@') {
      setShowSearchAgentModal(true);
    }
  }

  useEffect(() => {
    if (showSearchPromptModal)
      refSearchPromptInput.current?.focus();
  }, [showSearchPromptModal])

  useEffect(() => {
    if (showSearchAgentModal)
      refSearchAgentInput.current?.focus();
  }, [showSearchAgentModal])

  return {
    onKeyUp,
    showSearchPromptModal,
    setShowSearchPromptModal,
    showSearchAgentModal,
    setShowSearchAgentModal,
    refSearchPromptInput,
    refSearchAgentInput
  }
}