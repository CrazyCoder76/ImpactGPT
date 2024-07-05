'use client'

import { useState, useEffect } from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { toast } from 'sonner'

import { IconMark, IconSpinner } from '@/components/ui/icons';
import { Group } from '@/lib/types';
import { addNewGroup, updateGroup } from '@/actions/group';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface GroupFormDialogProps extends DialogProps {
    state: number,
    updatePage: any,
    group?: Group
}

export function GroupFormDialog({ ...props }: GroupFormDialogProps) {
    const { state, group, onOpenChange, open, updatePage } = props;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [expireDate, setExpireDate] = useState<any>(new Date());
    const [creditLimit, setCreditLimit] = useState('');

    useEffect(() => {
        if (state == 1) {
            setName('');
            setDescription('');
            setCreditLimit('');
            setExpireDate(new Date());
        }
        else if (state == 2) {
            if (group) {
                setName(group.name);
                setDescription(group.description);
                setExpireDate(group.expireDate);
                setCreditLimit(group.creditLimit?.toString());
            }
        }
        setErrMsg('');
    }, [open])

    const validate = () => {
        if(!name || name.length == 0) {
            return {
                status: 'error',
                msg: 'Name is required!'
            }
        }
        return {
            status: 'success'
        }
    }

    const onClick = async () => {
        if (state == 1) {
            try {
                // validate input
                const result = validate();
                if(result.status == 'error'){
                    setErrMsg(result.msg || '');
                    return;
                }
                setIsPending(true);
                const res = await addNewGroup(name, description, expireDate, parseInt(creditLimit));
                if (res.status == 'success') {
                    {/* @ts-ignore */ }
                    onOpenChange(false);
                    updatePage();
                    toast.success('A New Group created!');
                }
                else {
                    if (res.msg) setErrMsg(res.msg);
                }
            }
            catch (err: any) {
                setErrMsg('Error');
            }
            setIsPending(false);
        }
        else if (state == 2) {
            try {
                setIsPending(true);
                if (group) {
                    const res = await updateGroup(group._id || '', {
                        name: name,
                        description: description,
                        expireDate: expireDate,
                        creditLimit: parseInt(creditLimit)
                    });
                    if (res.status == 'success') {
                        {/* @ts-ignore */ }
                        onOpenChange(false);
                        updatePage();
                        toast.success('Update Success!');
                    }
                    else {
                        if (res.msg) setErrMsg(res.msg);
                    }
                }
                else setErrMsg('Unexpected Error!');

            }
            catch (err: any) {
                setErrMsg('Unexpected Error!');
            }
            setIsPending(false);
        }
    }

    return (
        <Dialog {...props}>
            <DialogContent style={{ width: '400px' }}>
                <div className='text-gray-800 dark:text-white text-left text-sm'>
                    <div>
                        <h2 data-element-id="prompt-library-modal-title" className="text-center text-2xl font-bold text-gray-800 dark:text-white">
                            {state == 1 ? 'Add New Group' : 'Update a Group'}
                        </h2>

                        <div className='mt-4'>
                            <div className='-mt-2 mb-4'>
                                <span>Name: </span>
                                <input type="text" placeholder="Enter user name" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={name} onChange={(e) => { setName(e.currentTarget.value) }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Description: </span>
                                <textarea placeholder="Type Description" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={description} onChange={(e) => { setDescription(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Expire Date:<br/></span>
                                <DatePicker
                                    className='border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800'
                                    selected={expireDate}
                                    onChange={(date) => setExpireDate(date)}
                                />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Monthly Credit: </span>
                                <input type="text" placeholder="Enter credit limit" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={creditLimit} onChange={(e) => { setCreditLimit(e.currentTarget.value) }} />
                            </div>
                        </div>

                        <span className='text-red-500' >{errMsg}</span>
                    </div>
                    <div className='text-center my-4'>
                        <Button className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-default transition-colors whitespace-nowrap gap-1'
                            onClick={onClick}>
                            {isPending ? <IconSpinner /> : <IconMark />}
                            <span>{state == 1 ? 'Save' : 'Update'}</span>
                        </Button>
                        <Button className='text-black dark:text-white transition font-bold py-2 px-4 rounded inline-flex space-x-1 justify-center items-center'
                            onClick={() => {
                                {/* @ts-ignore */ }
                                onOpenChange(false);
                            }}>
                            Cancel
                        </Button>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
