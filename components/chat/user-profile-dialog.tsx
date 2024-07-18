'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { getUserById, updateUser } from '@/actions/user'
import { User } from '@/lib/types'
import { useProfileStore } from '@/lib/store'
import { IconSpinner } from '../ui/icons'

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export function UserProfileDialog({ ...props }) {
  const session = props.session;
  const {isUpdatingProfile, setIsUpdatingProfile} = useProfileStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(false);
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadInitialData = async () => {
    try {
      const data = await getUserById(session?.user?.id);
      setFirstName(data?.firstName);
      setLastName(data?.lastName);
      setBio(data?.bio);
    }
    catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, [])

  const onClickSave = async () => {
    if(!firstName || !lastName) {
      setError(true);
      return;
    }
    try {
      setIsSaving(true);

      const res = await updateUser(session.user.id, {
        name: firstName + " " + lastName,
        firstName,
        lastName,
        bio
      });
      if (!res.success) {
        throw new Error("");
      }
      
      toast.success(`Successfully updated profile`);
      setIsUpdatingProfile(!isUpdatingProfile);
    }
    catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again");
    }
    finally {
      setIsSaving(false);
    }
  }

  const onClickCancel = () => {
    setIsUpdatingProfile(!isUpdatingProfile);
  }

  return (
    <>
      <Dialog {...props} open={isUpdatingProfile} onOpenChange={() => setIsUpdatingProfile(!isUpdatingProfile)}>
        <DialogContent className="p-8 flex items-center flex-col w-[400px] lg:w-fit">
          <div className='text-3xl font-semibold'>Account Information</div>
          <div>Enter your details so that your team can recognize you.</div>
          <div className="w-full flex gap-4 pt-8">
            <div className='flex-1'>
              <div className='font-semibold'>First Name*</div>
              <Input
                className={`w-full border ${error && !firstName ? "border-red-600" : "border-gray-300"}  dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800 bg-white text-black`}
                value={firstName || ""}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className='flex-1'>
              <div className='font-semibold'>Last Name*</div>
              <Input
                className={`w-full border ${error && !lastName ? "border-red-600" : "border-gray-300"}  dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800 bg-white text-black`}
                value={lastName || ""}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className='w-full'>
            <div className='font-semibold'>About Me</div>
            <Textarea
              className='w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800 bg-white text-black'
              value={bio || ""}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <div className='flex gap-4 pt-8'>
            <Button
              variant='default'
              className="inline-flex items-center px-8 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 gap-2"
              onClick={onClickSave}
            >
              { isSaving
                ? <IconSpinner />
                : <div>Save</div>
              }
            </Button>
            <Button
              variant='default'
              className='text-blue-500 hover:text-blue-800 inline-flex justify-center items-center font-semibold space-x-1 shrink-0 truncate py-2 px-8'
              onClick={onClickCancel}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}