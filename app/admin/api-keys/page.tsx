'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { IconAnthropic, IconCheck, IconGPT, IconGemini } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ApiKey } from '@/lib/types'
import { getApiKeys } from "@/actions/api_key"
import KeyItem from "@/components/admin/api-keys/key-item"



export default function IndexPage() {

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getApiKeys();
      if (res.status == 'success') {
        if (res.data) setApiKeys(res.data);
      }
    })();
  }, []);

  return (
    <div>
      <div className="space-y-6 mt-10">
        {
          apiKeys.map((apiKey: ApiKey, index: number) => {
            return (
              <KeyItem key={index} apiKey={apiKey} />
            )
          })
        }
      </div>
    </div>
  )
}




// type ApiKey = {
//   name: string
//   image: React.ReactNode
//   placeholder: string
//   link: string
// }

// const apiKeys: ApiKey[] = [
//   {
//     name: "OpenAI",
//     image: <IconGPT />,
//     placeholder: "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//     link: 'https://platform.openai.com/account/api-keys'
//   },
//   {
//     name: "Anthropic",x
//     image: <IconAnthropic />,
//     placeholder: "sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//     link: ''
//   },
//   {
//     name: 'Google Gemini',
//     image: <img src='https://typingcloud.com/assets/gemini.png' />,
//     placeholder: 'AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
//     link: ''
//   }
// ]