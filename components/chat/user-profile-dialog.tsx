'use client'

import { IconArrowRight, IconSpinner } from "@/components/ui/icons"
import { type DialogProps } from '@radix-ui/react-dialog'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import React, { SetStateAction } from "react"
import useStore from "@/lib/store"
import { toast } from "sonner"

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export function UserProfileDialog({ ...props }) {
  const { currentUser } = useStore();

  return (
    <>
      <Dialog {...props}>
        <DialogContent className="w-[400px]">
          <div className=" h-[400px] bg-black">

          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}