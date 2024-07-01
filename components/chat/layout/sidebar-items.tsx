'use client'

import { Chat } from '@/lib/types'
import { AnimatePresence, motion } from 'framer-motion'

import { shareChat } from '@/app/(chat)/actions'

import { SidebarActions } from '@/components/chat/layout/sidebar-actions'
import { SidebarItem } from '@/components/chat/layout/sidebar-item'

interface SidebarItemsProps {
  chats: Chat[]
}

export function SidebarItems({ chats }: SidebarItemsProps) {
  if (!chats?.length) return null;
  // console.log('****** display chat list ****');
  // console.log(chats.length);
  return (
    <AnimatePresence>
      {chats.map(
        (chat, index) => {
          // console.log(index);
          return (
            <motion.div
              key={index}
              exit={{
                opacity: 0,
                height: 0
              }}
            >
              <SidebarItem index={index} chat={chat}>
                <SidebarActions
                  chat={chat}
                  // removeChat={null}
                  shareChat={shareChat}
                />
              </SidebarItem>
            </motion.div>
          )
        }
      )}
    </AnimatePresence>
  )
}
