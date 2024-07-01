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
import { IconAdd, IconArrowLeft, IconEdit, IconRemove, IconThreeDots, IconUser } from "@/components/ui/icons";
import { getGroups, deleteGroup } from '@/actions/group';
import { Group } from '@/lib/types';
import { GroupFormDialog } from '@/components/admin/groups/group-form-dialog';

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
                console.log(response);
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
            const res = await deleteGroup(id);
            if (res.status = 'success') {
                toast.success('Removed Successfully!');
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {/*  each group */}
                        {
                            groups && groups.map((group, index) => (
                                <tr className="hover:bg-gray-50 cursor-pointer" key={group._id}>
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
