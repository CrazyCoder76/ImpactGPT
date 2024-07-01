'use client'

import Link from "next/link"
import { useEffect } from "react"
import { checkEmailSettingsExists } from "../email-settings/action"
import { checkAPIKeysExists } from "@/actions/api_key"
import { checkModelsExists } from "../models/action"

type NavCard = {
  title: string
  description: string
  link: string
}

const navCards: NavCard[] = [
  {
    title: 'API Keys',
    description: 'Activate OpenAI, Claude, PaLM models',
    link: '/admin/api-keys',
  },
  {
    title: 'Manage Models',
    description: 'Enable/disable models (GPT-3.5, GPT-4, Claude, etc.)',
    link: '/admin/models'
  },
  {
    title: 'AI Agents',
    description: 'Build smart AI agents',
    link: '/admin/agents'
  },
  {
    title: 'Prompts Library',
    description: 'Create a prompt library for your users',
    link: '/admin/prompts'
  }
]

export default function IndexPage() {
  useEffect(() => {
    const checkFunc = async () => {
      await checkEmailSettingsExists();
      await checkAPIKeysExists();
      await checkModelsExists();
    }

    checkFunc();
  })

  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900 mt-10 mb-4">
        Manage Your Instance
      </h3>
      <div className="gap-3 grid grid-cols-1 sm:grid-cols-3">
        {navCards.map((card: NavCard, index: number) => <Link key={index} href={card.link}>
          <div className="overflow-hidden rounded-lg bg-white shadow px-5 py-4 transition-all hover:shadow-md hover:bg-gray-100">
            <div className="truncate text-xl font-semibold text-gray-900">{card.title}</div>
            <div className="mt-1 text-sm font-normal tracking-tight text-gray-500">{card.description}</div>
          </div>
        </Link>)}
      </div>
    </div>
  )
}