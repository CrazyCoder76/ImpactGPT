    "use client";

import { useEffect, useRef, useState } from 'react';

//import components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserFormDialog } from '@/components/admin/members/user-form-dialog';
import { IconAdd, IconArrowLeft, IconEdit, IconRemove, IconThreeDots, IconUser, IconDisable, IconInvite, IconExport, IconImport, IconDownload } from "@/components/ui/icons";
import { toast } from 'sonner'
import { format } from 'date-fns'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';
import { getStringFromBuffer, ResultCode } from '@/lib/utils'

//import types
import { Group, User } from '@/lib/types';

//import actions
import { deleteUserById, updateUser, getAllUsers, createUser } from '@/actions/user';
import { getGroups } from '@/actions/group';
import { InviteFormDialog } from '@/components/admin/members/invite-form-dialog';
import { userInfo } from 'os';
import Papa from 'papaparse'
import { sentInviteEmail } from '@/actions/mail';
import { sampleUsers } from '@/lib/constants';

const csv_headers = [
    'Email', 'Title', 'Firstname', 'Lastname', 'Gender', 'Date of Birth', 'Company', 'Department',
    'Team', 'Position', 'Rank', 'Location', 'Employee ID', 'Personal Info',
    'Telephone Number', 'Mobile Phone Number', 'LINE ID', 'Group'
];

const Index = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    const [pageState, setPageState] = useState(0);
    const [updateFlag, setUpdateFlag] = useState(false);
    const [userOnUpdating, setUserOnUpdating] = useState<User>();
    const [file, setFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

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
    
    const hashPasswordBuffer = (saltedPassword: any) => {
        const hash = crypto.createHash('sha256');
        hash.update(saltedPassword);
        return hash.digest();
    };
    
    const convertToCSV = (users: User[]): string => {
        const group_dict: { [key: string]: string } = {};
        groups.map(group => { group_dict[group?._id || ""] = group.name });
    
        const csvRows = users.map(user => [
            user.email,
            user.title,
            user.firstName,
            user.lastName,
            user.gender,
            user.dateOfBirth?.toISOString(),
            user.company,
            user.department,
            user.team,
            user.position,
            user.rank?.toString(),
            user.location,
            user.employeeId,
            user.bio,
            user.phoneNumber,
            user.mobileNumber,
            user.lineId,
            group_dict[user.groupId]
        ]);
    
        return [
            csv_headers.join(','),
            ...csvRows.map(row => row.join(','))
        ].join('\n');
    };
    
    const loadSampleCSV = (users: any): string => {
        const csvRows = users.map((user: any) => {
            return csv_headers.map((header: string) => user[header]);
        });
    
        return [
            csv_headers.join(','),
            ...csvRows.map((row: any) => row.join(','))
        ].join('\n');
    };

    const deleteUser = async (userId: string) => {
        try {
            const res = await deleteUserById(userId);
            if(res?.success) {
                setUpdateFlag((flag) => !flag);
                toast.success("Successfully deleted the user");
            }
            else {
                toast.error(res?.messsage);
            }
        }
        catch (err: any) {
            toast.error(err.message);
        }
    }

    const disableUser = async (userId: string) => {
        try {
            const res = await updateUser(userId, { status: 'disabled'});
            if(res?.success) {
                setUpdateFlag((flag) => !flag);
                toast.success("Successfully disabled the user");
            }
            else {
                toast.error(res?.message);
            }
        }
        catch (err: any) {
            toast.error(err.message);
        }
    }

    const enableUser = async (userId: string) => {
        try {
            const res = await updateUser(userId, { status: 'created' });
            if(res?.success) {
                setUpdateFlag((flag) => !flag);
                toast.success("Successfully enabled the user");
            }
            else {
                toast.error(res?.message);
            }
        }
        catch (err: any) {
            toast.error(err.message);
        }
    }

    const inviteUser = async (user: User) => {
        try {
            const emailSentResult = await sentInviteEmail({to: user.email});
            if(emailSentResult === 'success') {
                const res = await updateUser(user._id, { status: 'invited' });
                if(res?.success) {
                    setUpdateFlag((flag) => !flag);
                    toast.success(`Invitation sent to ${user.email}`);
                }
                else {
                    toast.error(res?.message);
                }
            }
            else {
                toast.error(`Invitation email was not sent to ${user.email}`)
            }
        }
        catch (err: any) {
            toast.error(err.message);
        }
    }

    const handleDownloadCSV = async () => {
        const csvContent = convertToCSV(users);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadSampleCSV = async () => {
        const csvContent = loadSampleCSV(sampleUsers);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sample.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
            handleImportCSV(e.target.files[0])
            if (fileInputRef.current) {
                (fileInputRef.current as HTMLInputElement).value = '';
            }
            setFile(null)
        }
    }
    
    const handleImportCSV = async (selectedFile: File) => {
        if (!selectedFile) return
        const reader = new FileReader()
        reader.onload = async ({ target }) => {
            try {
                const csv = Papa.parse(target?.result as string, { header: true });
                const parsedData = csv?.data;
                let count = 0;
                
                const group_dict: { [key: string]: string } = {};
                groups.map(group => { group_dict[group.name] = (group._id || "") });
                const n = parsedData.length;

                for(let i = 0; i < n; i++) {
                    try {
                        const user: any = parsedData[i];
                        const encoder = new TextEncoder();
                        const salt = uuidv4();
                        const saltedPassword = encoder.encode("123456" + salt);
                        const hashedPasswordBuffer = hashPasswordBuffer(saltedPassword);
                        const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);
                        let creditLimit: Number = 0;
                        let expireDate: any = undefined;
        
                        const userGroup = groups.find(group => group.name == user[csv_headers[17]]);
                        if (userGroup) {
                            creditLimit = userGroup.creditLimit;
                            expireDate = userGroup.expireDate
                        }

                        const result = await createUser(
                            user[csv_headers[1]],
                            user[csv_headers[2]],
                            user[csv_headers[3]],
                            user[csv_headers[2]] + " " + user[csv_headers[3]],
                            user[csv_headers[0]],
                            user[csv_headers[4]]?.toLowerCase(),
                            new Date(user[csv_headers[5]]),
                            user[csv_headers[6]],
                            user[csv_headers[7]],
                            user[csv_headers[9]],
                            parseInt(user[csv_headers[10]]) || undefined,
                            user[csv_headers[11]],
                            user[csv_headers[8]],
                            user[csv_headers[12]],
                            user[csv_headers[13]],
                            user[csv_headers[14]],
                            user[csv_headers[15]],
                            user[csv_headers[16]],
                            group_dict[user[csv_headers[17]]] || undefined,
                            hashedPassword,
                            salt,
                            expireDate,
                            creditLimit
                        );
                        if (result.type == 'success') {
                            count ++;
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                if (count > 0) {
                    toast.success(`Successfully imported ${count} user${count > 1 ? "s" : ""}`);
                }
                else {
                    toast.success("Users are already exist");
                }
            }
            catch (error) {
                toast.error("CSV format is incorrect!");
            }
            finally {
                setUpdateFlag((flag) => !flag);
            }
        }

        reader.readAsText(selectedFile);
    }
    
    const onHandleClickImportCSV = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        fileInputRef.current?.click();
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-white px-8 py-4">
            <div>
                {
                    pageState == 1 ? <UserFormDialog open={true}
                        state={pageState} setPageState={setPageState} setUpdateFlag={setUpdateFlag} inviteUser={inviteUser} /> :
                        pageState == 2 ?
                            <UserFormDialog open={true} user={userOnUpdating}
                                state={pageState} setPageState={setPageState} setUpdateFlag={setUpdateFlag} inviteUser={inviteUser} /> :
                            pageState === 3 ? <InviteFormDialog open={true} setPageState={setPageState} setUpdateFlag={setUpdateFlag} inviteUser={inviteUser} /> : <></>
                }
                <div className="font-semibold"><div>
                    Current members: {users && users.length}
                </div>
                </div>
                <div className="my-4 flex items-center justify-between gap-2">
                    <div className="flex items-center justify-start gap-2">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 gap-2" onClick={() => { setPageState(3) }}>
                            <IconAdd />
                            <span>Invite Members</span>
                        </button>
                        <button onClick={() => { setPageState(1); }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 gap-2" rel="noreferrer noopener">
                            <IconArrowLeft />
                            <span>Add New Member</span>
                        </button>
                    </div>
                    <div className="hidden lg:flex items-center justify-start gap-2">
                        <button onClick={onHandleClickImportCSV} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 gap-2" rel="noreferrer noopener">
                            <IconImport />
                            <span>Import Users</span>
                        </button>
                        <button onClick={handleDownloadCSV} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 gap-2" rel="noreferrer noopener">
                            <IconExport />
                            <span>Export CSV</span>
                        </button>
                        <button onClick={handleDownloadSampleCSV} className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm text-blue-600 border-blue-600 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 gap-2" rel="noreferrer noopener">
                            <IconDownload />
                            <span>Download sample file</span>
                        </button>
                    </div>
                    
                    <div className="lg:hidden relative inline-block text-left" data-headlessui-state="">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="hover:bg-gray-100 rounded-full size-10 flex items-center justify-center" id="headlessui-menu-button-:r3:" type="button" aria-haspopup="menu" aria-expanded="false" data-headlessui-state="">
                                    <IconThreeDots />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem className="flex-col items-start">
                                    <button onClick={onHandleClickImportCSV}
                                        className="text-gray-700 space-x-2 flex w-full items-center justify-start px-4 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                    >
                                        <IconImport />
                                        <span>Import Users</span>
                                    </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex-col items-start">
                                    <button onClick={handleDownloadCSV}
                                        className="text-gray-700 space-x-2 flex w-full items-center justify-start px-4 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                    >
                                        <IconExport />
                                        <span>Export CSV</span>
                                    </button>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex-col items-start">
                                    <button onClick={handleDownloadSampleCSV}
                                        className="text-gray-700 space-x-2 flex w-full items-center justify-start px-4 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                    >
                                        <IconDownload />
                                        <span>Download sample file</span>
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className='hidden'
                    />
                </div>

                {/* Member List */}
                <div className="mt-8 overflow-x-auto">
                    <table className="w-full min-w-[600px] divide-y divide-gray-300 mb-10">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Member</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Roles</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Group</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expire Date</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Monthly Credit</th>
                                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {/*  each user */}
                            {
                                users && users.map((user, index) => (
                                    <tr className={`hover:bg-gray-50 cursor-pointer ${(user.status === 'disabled' || user.status === 'expired') && "bg-gray-300 hover:bg-gray-400"}`} key={user._id}>
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
                                        <td className="py-4 px-3 text-sm overflow-hidden">
                                            <div className="[&amp;>*]:m-0.5 -m-0.5">
                                                {user.expireDate ? format(user.expireDate, 'MMMM dd, yyyy') : ''}
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-sm overflow-hidden text-right">
                                            <div className="[&amp;>*]:m-0.5 -m-0.5">
                                                {`${user.creditUsage || 0}/${user.creditLimit || 0}`}
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-sm overflow-hidden text-right">
                                            <div className="[&amp;>*]:m-0.5 -m-0.5">
                                                {user.status === 'disabled' ? "Disabled" : user.status === 'expired' ? "Expired" : user.status == 'invited' ? "Invited" : ""}
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
                                                            <button disabled={user?.role === 0 || user.status === 'disabled'} onClick={() => {
                                                                inviteUser(user);
                                                            }} className="text-gray-700 space-x-2 flex w-full items-center justify-start px-4 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                                            >
                                                                <IconInvite />
                                                                <span>Invite</span>
                                                            </button>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex-col items-start">
                                                            <button disabled={user?.role === 0} onClick={() => {
                                                                user.status === 'disabled' ? enableUser(user._id) : disableUser(user._id);
                                                            }} className="text-gray-700 space-x-2 flex w-full items-center justify-start px-4 py-2 text-sm whitespace-nowrap disabled:cursor-default disabled:opacity-50"
                                                            >
                                                                <IconDisable />
                                                                <span>{ user.status === 'disabled' ? "Enable" : "Disable" }</span>
                                                            </button>
                                                        </DropdownMenuItem>
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
