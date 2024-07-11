import { useRef, type RefObject } from 'react'

export function useEnterSubmit({ pending, isEnterToSend }: { pending: boolean, isEnterToSend: boolean }): {
  formRef: RefObject<HTMLFormElement>
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void
} {
  const formRef = useRef<HTMLFormElement>(null)

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (isEnterToSend) {
      if (
        event.key === 'Enter' &&
        !event.shiftKey &&
        !event.nativeEvent.isComposing &&
        !pending
      ) {
        formRef.current?.requestSubmit()
        event.preventDefault()
      }
    }
    if (event.key === 'Tab') {
      const input = event.currentTarget;
      const rx = /\{\{[^}]+\}\}/
      const from = input.selectionEnd
      const str = input.value.slice(from);
      const match = rx.exec(str);
      if (match) {
        const st = from + str.indexOf(match[0]);
        const ed = st + match[0].length;
        input.selectionEnd = ed;
        input.selectionStart = st;
        event.preventDefault();
      }
    }
  }

  return { formRef, onKeyDown: handleKeyDown }
}
