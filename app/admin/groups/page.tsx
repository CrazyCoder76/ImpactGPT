"use client";

import { useEffect, useState } from 'react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { toast } from 'sonner';
import { IconAdd, IconArrowLeft, IconDisable, IconEdit, IconInvite, IconRemove, IconThreeDots, IconUser } from "@/components/ui/icons";
import { getGroups, deleteGroup, updateGroup } from '@/actions/group';
import { Group } from '@/lib/types';
import { GroupFormDialog } from '@/components/admin/groups/group-form-dialog';
import { format } from 'date-fns'
import { deleteUserById, getGroupUsers, updateUser } from '@/actions/user';
import { sentInviteEmail } from '@/actions/mail';

const Page = () => {

    const [groups, setGroups] = useState<Group[]>([]);
    const [groupFormOpen, setGroupFormOpen] = useState(false);
    const [pageState, setPageState] = useState(0);
    const [updateFlag, setUpdateFlag] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group>();
    /*
    0: normal
    1: adding
    2: updating
    */
    useEffect(() => {
        (async () => {
            try {
                const response = await getGroups();
                if (response.status == 'success') {
                    setGroups(response.data);
                }
            }
            catch (err: any) {

            }
        })();
    }, [updateFlag]);

    const updatePage = () => {
        setUpdateFlag((flag) => !flag);
    }

    const onDeleteGroup = async (id: string) => {
        try {
            const users = await getGroupUsers(id);

            users?.map((user: any) => deleteUserById(user.id));
            
            const res = await deleteGroup(id);
            if (res.status = 'success') {
                toast.success('Group removed Successfully!');
                updatePage();
            }
            else {
                toast.error(res.msg);
            }
        }
        catch (err: any) {
            toast.error('Unexpected Error!');
        }
    }

    const onDisableGroup = async (id: string) => {

        try {
            const users = await getGroupUsers(id);
            users?.map((user: any) => updateUser(user.id, { status: 'disabled' }));

            const res = await updateGroup(id, {
                status: 'disabled'
            });

            if (res.status == 'success') {
                updatePage();
                toast.success('Successfully disabled the group!');
            }
            else {
                toast.error(res.msg);
            }
        }
        catch (err: any) {
            toast.error(err.message);
        }
    }

    const onEnableGroup = async (id: string) => {

        try {
            const users = await getGroupUsers(id);
            users?.map((user: any) => updateUser(user.id, { status: '' }));

            const res = await updateGroup(id, {
                status: ''
            });
            
            if (res.status == 'success') {
                updatePage();
                toast.success('Successfully enabled the group!');
            }
            else {
                toast.error(res.msg);
            }
        }
        catch (err: any) {
            toast.error(err.message);
        }
    }

    const inviteGroup = async (id: string) => {
        
        try {

            const users = await getGroupUsers(id);
            if(!users) {
                throw new Error("No user in this group");
            }

            for(let i = 0; i < users?.length; i++) {
                try {
                    const user = users[i];
                    const emailSentResult = await sentInviteEmail({to: user.email});
                    if(emailSentResult === 'success') {
                        const res = await updateUser(user.id, { status: 'invited' });
                        if(res?.success) {
                            setUpdateFlag((flag) => !flag);
                            toast.success(`Invitation sent ${user.email}`);
                        }
                        else {
                            toast.error(res?.message);
                        }
                    }
                    else {
                        toast.error('Invitation email was not sent')
                    }
                }
                catch (err: any) {
                    toast.error(err.message);
                }
            }

            const res = await updateGroup(id, {
                status: 'invited'
            });

            
            if (res.status == 'success') {
                updatePage();
                toast.success('Successfully Invited the group!');
            }
            else {
                toast.error(res.msg);
            }
        }
        catch (err: any) {
            toast.error(err.message);
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-white px-8 py-4">

            <GroupFormDialog state={pageState} group={editingGroup}
                updatePage={updatePage}
                open={groupFormOpen} onOpenChange={setGroupFormOpen} />

            <div className="my-4 flex items-center justify-start gap-2">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 gap-2" rel="noreferrer noopener"
                    onClick={() => { setPageState(1); setGroupFormOpen(true) }}>
                    <IconArrowLeft />
                    <span>Add New Group</span>
                </button>
            </div>

            {/* Member List */}
            <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[600px] divide-y divide-gray-300 mb-20">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Number</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expire Date</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Credit Limit</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {/*  each group */}
                        {
                            groups && groups.map((group, index) => (
                                <tr className={`hover:bg-gray-50 cursor-pointer ${(group.status === 'disabled' || group.status === 'expired') && "bg-gray-300 hover:bg-gray-400"}`} key={group._id}>
                                    <td className="py-4 px-3 text-sm overflow-hidden">
                                        <div className="[&amp;>*]:m-0.5 -m-0.5">
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-4 px-3 text-sm">
                                        <div className="flex items-center space-x-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-1">
                                                    <span className="font-medium text-gray-900">{group.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-sm overflow-hidden">
                                        <div className="[&amp;>*]:m-0.5 -m-0.5">
                                            {group.description}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-sm overflow-hidden">
                                        <div className="[&amp;>*]:m-0.5 -m-0.5">
                                            {group.expireDate ? format(group.expireDate, 'MMMM dd, yyyy') : ''}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-sm overflow-hidden">
                                        <div className="[&amp;>*]:m-0.5 -m-0.5">
                                            {group.creditLimit?.toString()}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-sm overflow-hidden">
                                        <div className="[&amp;>*]:m-0.5 -m-0.5">
                                            {group.status == 'disabled' ? "Disabled" : group.status == 'expired' ? "Expired" : group.status == 'invited' ? "Invited" : ""}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3 text-sm text-right">
                                        <div className="relative inline-block text-left" data-headlessui-state="">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center" id="headlessui-menu-button-:r3:" type="button" aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
                                                        <IconThreeDots />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem className="flex-col items-start">
                                                        <button disabled={group.status === 'disabled'} onClick={() => {
                                                            inviteGroup(group?._id || "");
                                                        }} className="text-gray-700 space-x-2 flex w-full items-center justify-start px-4 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                                        >
                                                            <IconInvite />
                                                            <span>Invite</span>
                                                        </button>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex-col items-start">
                                                        <button className="text-gray-700 space-x-2 flex w-full items-center justify-start px-4 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                                            onClick={() => {
                                                                group.status === 'disabled' ? group._id && onEnableGroup(group._id) : group._id && onDisableGroup(group._id);
                                                            }}>
                                                            <IconDisable />
                                                            <span>{ group.status === 'disabled' ? "Enable" : "Disable" }</span>
                                                        </button>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex-col items-start">
                                                        <button className="text-gray-700 space-x-2 flex w-full items-center justify-start px-4 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                                            onClick={() => {
                                                                setPageState(2);
                                                                setGroupFormOpen(true);
                                                                setEditingGroup(group);
                                                            }}>
                                                            <IconEdit />
                                                            <span>Edit</span>
                                                        </button>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex-col items-start">
                                                        <button className="text-gray-700 space-x-2 flex w-full items-center justify-start px-3 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                                            onClick={() => {
                                                                onDeleteGroup(group._id || '');
                                                            }}>
                                                            <IconRemove />
                                                            <span>Remove</span>
                                                        </button>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default Page;
