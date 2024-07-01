'use client'

import { useState, useEffect } from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';

import { IconEye, IconMark, IconSpinner } from '@/components/ui/icons';
// import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { Group, User } from '@/lib/types';
import { ResultCode, getStringFromBuffer } from '@/lib/utils'
import { z } from 'zod'
import { createUser, updateUser } from '@/actions/user'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';
import { getGroups } from '@/actions/group';
// import { findGroupById, findGroupByName } from '@/actions/group'

interface UserFormDialogProps extends DialogProps {
    state: number,
    setPageState: any,
    setUpdateFlag: any,
    user?: User
}

export function UserFormDialog({ ...props }: UserFormDialogProps) {
    const { state, setPageState, user, setUpdateFlag } = props;

    // const [name, setName] = useState('example');
    // const [email, setEmail] = useState('example@gmail.com');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [showPassword, setShowPassword] = useState(false);

    const [isOnRunning, setIsOnRunning] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [isExistGroups, setIsExistGroups] = useState<boolean>(false);
    const [groupId, setGroupId] = useState<string>('');
    const [groups, setGroups] = useState<Group[]>([]);

    const hashPasswordBuffer = (saltedPassword: any) => {
        const hash = crypto.createHash('sha256');
        hash.update(saltedPassword);
        return hash.digest();
    };

    useEffect(() => {
        if (state === 2 && user) { // when upating user, init the fields
            let initName = user.name;
            let initEmail = user.email;

            let initGroupName = user.groupName
            setName(initName);
            setEmail(initEmail);
            setPassword('');
            // setGroupName(initGroupName);
        }

        // Get Groups
        (async () => {
            const res = await getGroups();
            if (res.status == 'success') {
                setGroups(res?.data);
                setIsExistGroups(true);
            }
        })();

    }, [state, user]);

    const onClick = async () => {
        const parsedInfo = z
            .object({
                name: z.string().min(1),
                email: z.string().email(),
                password: state == 1 ? z.string().min(6) : z.string().min(0)
            })
            .safeParse({ name, email, password });
        if (!parsedInfo.success) {
            setErrorMsg('Invalid Information!');
            return;
        }
        try {
            if (state == 1) { // create new user
                const encoder = new TextEncoder()
                const salt = uuidv4()
                const saltedPassword = encoder.encode(password + salt)
                const hashedPasswordBuffer = hashPasswordBuffer(saltedPassword);
                const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)
                setIsOnRunning(true);
                const result = await createUser(name, email, groupId, hashedPassword, salt);
                if (result.resultCode !== ResultCode.UserCreated) throw new Error();
                setUpdateFlag((flag: any) => !flag);
                setPageState(0);
            }
            else if (state == 2) { //update a user
                if (!user) return;
                setIsOnRunning(true);
                const res = await updateUser(user._id, {
                    name: name,
                    email: email,
                    password: password,
                    groupId: groupId
                });
                if (!res.success) {
                    setErrorMsg('Failed!');
                }
                setIsOnRunning(false);
                setUpdateFlag((flag: any) => !flag);
                setPageState(0);
            }
        }
        catch (err: any) {
            setIsOnRunning(false);
            setErrorMsg('User Registeration Failed!');
        }
    }
    return (
        <>{isExistGroups && <Dialog {...props}>
            <DialogContent style={{ width: '400px' }}>
                <div className='text-gray-800 dark:text-white text-left text-sm'>
                    <div>
                        <h2 data-element-id="prompt-library-modal-title" className="text-center text-2xl font-bold text-gray-800 dark:text-white">
                            {state == 1 ? 'Add New User' : 'Update User'}
                        </h2>

                        <div className='mt-4'>
                            <div className='-mt-2 mb-4'>
                                <span>Name: </span>
                                <input type="text" placeholder="Enter user name" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={name} onChange={(e) => { setName(e.currentTarget.value) }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Email: </span>
                                <input type="email" placeholder="Enter email" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={email} onChange={(e) => { setEmail(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Password: </span>

                                <input type='password' placeholder="Enter Your password" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={password} onChange={(e) => { setPassword(e.currentTarget.value); }} />

                                {/* <div className='flex gap-1 items-center mt-1'>
                                <IconEye className="text-black w-7 h-7" />
                                <span className='cursor-pointer' onClick={() => {
                                    setShowPassword((flag) => !flag);
                                }}>
                                    {showPassword ? 'Hide' : 'Show'}
                                </span>
                            </div> */}
                            </div>
                            <div className='-mt-2 mb-4 flex items-center gap-6'>
                                <span>Group: </span>
                                <select
                                    value={groupId}
                                    onChange={(e) => { setGroupId(e.target.value); }}
                                    className="block w-fit rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 dark:text-white dark:bg-zinc-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                                >
                                    <option value='' key={0}>Default</option>
                                    {
                                        groups?.map((group, index: number) =>
                                            <option value={group._id} key={index + 1}>{group.name}</option>
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                        <span className='text-red-500' >{errorMsg}</span>
                    </div>
                    <div className='text-center my-4'>
                        <Button onClick={onClick} className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap gap-1'>
                            {isOnRunning ? <IconSpinner /> : <IconMark />}
                            <span>{state === 1 ? 'Save' : 'Update'}</span>
                        </Button>
                        <Button onClick={() => {
                            setPageState(0);
                            setIsExistGroups(false);
                        }} className='text-black dark:text-white transition font-bold py-2 px-4 rounded inline-flex space-x-1 justify-center items-center'>
                            Cancel
                        </Button>

                    </div>
                </div>
            </DialogContent>
        </Dialog >}</>
    )
}
