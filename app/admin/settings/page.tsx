'use client'

import { Input } from '@/components/ui/input'
import useStore from '@/lib/store'
import { useEffect, useState } from 'react'

const Page = () => {
    const { currentUser } = useStore();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [editingEmail, setEditingEmail] = useState<boolean>(false);

    useEffect(() => {
        setName(currentUser?.user?.name || '');
        setEmail(currentUser?.user?.email || '');
    }, [currentUser]);

    return (
        <div className="min-h-[calc(100vh-64px)] bg- p-6 pb-20">
            <div className="mx-auto duration-300 max-w-3xl">
                <div>
                    <h2 className="text-xl font-semibold mt-8 mb-2">👮 Admin</h2>
                    <div>
                        <div className="my-4">
                            <span className="text-sm font-semibold my-1 block">Admin Name *</span>
                            <span className="text-xs text-gray-500 my-1">Will be shown as the &#39;Sender&#39; in the user&#39;s verification email when they sign up/login.</span>
                            <Input
                                name='name'
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                                placeholder='Name'
                                className='relative block w-full rounded-md border-0 text-gray-900 shadow-sm mt-3 ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 bg-white'
                            />
                        </div>
                        <div className='my-4'>
                            <span className='text-sm font-semibold my-1 block'>Admin Email *</span>
                            <span className='text-xs text-gray-500 my-1'>Will be shown as the &#39;reply-to&#39; address in the user&#39;s verification email when they sign up/login.</span>
                            <div className='mt-2 flex space-x-2 sm:max-w-[480px]'>
                                <Input
                                    name='email'
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                    placeholder='Enter new admin email'
                                    disabled={!editingEmail}
                                    className='relative block grow rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 px-3 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:py-1.5 sm:text-sm sm:leading-6 min-h-[36px] max-h-[500px] resize-none dark:bg-zinc-600 dark:text-white dark:ring-gray-500 dark:focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:ring-gray-200 bg-white'
                                />
                                {!editingEmail ? <button className='min-w-[140px] inline-flex items-center justify-center px-3 border border-transparent sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400' onClick={() => {
                                    setEditingEmail(true);
                                    setEmail('');
                                }}>Change Email</button> : (
                                    <>
                                        <button className='min-w-[80px] inline-flex items-center justify-center px-3 py-1.5 border border-transparent sm:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400' disabled={email !== '' && email === currentUser?.user?.email}>Verify</button>
                                        <button className='inline-flex items-center justify-center px-1 py-1.5 ml-4 border border-transparent sm:text-sm font-medium rounded-md text-whitefocus:outline-none text-gray-900 disabled:text-gray-500' onClick={() => {
                                            setEditingEmail(false);
                                            setEmail(currentUser?.user?.email || '');
                                        }}>Cancel</button>
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-8 text-center'>
                    <button className='min-w-[156px] inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400'>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Page;