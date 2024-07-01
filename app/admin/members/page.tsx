"use client";

import { useEffect, useState } from 'react';

//import components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserFormDialog } from '@/components/admin/members/user-form-dialog';
import { IconAdd, IconArrowLeft, IconEdit, IconRemove, IconThreeDots, IconUser } from "@/components/ui/icons";

//import types
import { Group, User } from '@/lib/types';

//import actions
import { deleteUserById, getAllUsers } from '@/actions/user';
import { getGroups } from '@/actions/group';
import { InviteFormDialog } from '@/components/admin/members/invite-form-dialog';

const Index = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    const [pageState, setPageState] = useState(0);
    const [updateFlag, setUpdateFlag] = useState(false);
    const [userOnUpdating, setUserOnUpdating] = useState<User>();
    // current state 
    // 0: normal
    // 1: adding user
    // 2: editing user
    // 3: inviting user

    useEffect(() => {
        (async () => {
            setUsers(await getAllUsers());
            const allGroups = await getGroups();
            setGroups(allGroups?.data);
        })();
    }, [updateFlag]);

    const deleteUser = async (userId: string) => {
        const res = await deleteUserById(userId);
        setUpdateFlag((flag) => !flag);
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-white px-8 py-4">
            <div>
                {
                    pageState == 1 ? <UserFormDialog open={true}
                        state={pageState} setPageState={setPageState} setUpdateFlag={setUpdateFlag} /> :
                        pageState == 2 ?
                            <UserFormDialog open={true} user={userOnUpdating}
                                state={pageState} setPageState={setPageState} setUpdateFlag={setUpdateFlag} /> :
                            pageState === 3 ? <InviteFormDialog open={true} setPageState={setPageState} /> : <></>
                }
                <div className="font-semibold"><div>
                    Current members: {users && users.length}
                </div>
                </div>

                <div className="my-4 flex items-center justify-start gap-2">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 gap-2" onClick={() => { setPageState(3) }}>
                        <IconAdd />
                        <span>Invite Members</span>
                    </button>
                    <button onClick={() => { setPageState(1); }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 gap-2" rel="noreferrer noopener">
                        <IconArrowLeft />
                        <span>Add New Member</span>
                    </button>
                </div>

                {/* Member List */}
                <div className="mt-8 overflow-x-auto">
                    <table className="w-full min-w-[600px] divide-y divide-gray-300 mb-20">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Member</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Roles</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Group</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {/*  each user */}
                            {
                                users && users.map((user, index) => (
                                    <tr className="hover:bg-gray-50 cursor-pointer" key={user._id}>
                                        <td className="whitespace-nowrap py-4 px-3 text-sm">
                                            <div className="flex items-center space-x-3">
                                                <div>
                                                    <div className="size-10 bg-gray-100 flex items-center justify-center shrink-0 rounded-full">
                                                        <IconUser />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-1">
                                                        <span className="font-medium text-gray-900">{user.name}</span>
                                                    </div>
                                                    <div className="text-gray-600 flex items-end space-x-1">
                                                        <span>{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-sm overflow-hidden">
                                            <div className="[&amp;>*]:m-0.5 -m-0.5">
                                                <div className="whitespace-nowrap inline-flex items-center rounded-full px-2 py-1 text-xs font-medium  ring-1 ring-inset bg-green-50 ring-green-600/20 text-green-700">
                                                    {user.role == 0 ? 'admin' : 'member'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-sm overflow-hidden">
                                            <div className="[&amp;>*]:m-0.5 -m-0.5">
                                                {groups.find(g => g._id === user.groupId)?.name}
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-sm text-right">
                                            <div className="relative inline-block text-left" data-headlessui-state="">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="hover:bg-gray-100 rounded-full size-10 flex items-center justify-center" id="headlessui-menu-button-:r3:" type="button" aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
                                                            <IconThreeDots />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem className="flex-col items-start">
                                                            <button onClick={() => {
                                                                setUserOnUpdating(user);
                                                                setPageState(2);
                                                            }} className="text-gray-700 space-x-2 flex w-full items-center justify-start px-4 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                                            >
                                                                <IconEdit />
                                                                <span>Edit</span>
                                                            </button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex-col items-start">
                                                            <button disabled={user?.role === 0} onClick={() => { deleteUser(user._id); }} className="text-gray-700 space-x-2 flex w-full items-center justify-start px-3 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50">
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
        </div>
    )
};

export default Index;
