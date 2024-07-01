'use client'

import * as React from 'react'
import copy from 'clipboard-copy'

export interface useCopyToClipboardProps {
  timeout?: number
}

export function useCopyToClipboard({
  timeout = 2000
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = React.useState<Boolean>(false)

  const copyToClipboard = async (value: string) => {
    if (!value) {
      return
    }

    if (typeof window !== 'undefined') {
      await copy(value);
      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, timeout)
    } else {
      const textarea = document.createElement('textarea');
      textarea.textContent = value;
      textarea.style.display = "none";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setIsCopied(true)

        setTimeout(() => {
          setIsCopied(false)
        }, timeout)
      } catch (err) {
        console.error(err);
        document.body.removeChild(textarea);
      }
    }
  }

  return { isCopied, copyToClipboard }
}
