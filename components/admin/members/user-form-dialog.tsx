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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'sonner';
// import { findGroupById, findGroupByName } from '@/actions/group'

interface UserFormDialogProps extends DialogProps {
    state: number,
    setPageState: any,
    setUpdateFlag: any,
    user?: User,
    inviteUser: Function
}

export function UserFormDialog({ ...props }: UserFormDialogProps) {
    const { state, setPageState, user, setUpdateFlag, inviteUser } = props;

    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('male');
    const [birthday, setBirthday] = useState<any>(new Date());
    const [company, setComapny] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [rank, setRank] = useState('');
    const [location, setLocation] = useState('');
    const [team, setTeam] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [bio, setBio] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [lineId, setLineId] = useState('');
    const [expireDate, setExpireDate] = useState<any>();
    const [creditLimit, setCreditLimit] = useState('');

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
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setTitle(user.title);
            setEmail(user.email);
            setGender(user.gender);
            setPassword('');
            setBirthday(user.dateOfBirth);
            setComapny(user.company);
            setDepartment(user.department);
            setPosition(user.position);
            setRank(user.rank?.toString());
            setLocation(user.location);
            setTeam(user.team);
            setEmployeeId(user.employeeId);
            setBio(user.bio);
            setPhoneNumber(user.phoneNumber);
            setMobileNumber(user.mobileNumber);
            setLineId(user.lineId);
            setGroupId(user.groupId);
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
                firstName: z.string().min(1),
                email: z.string().email(),
                password: state == 1 ? z.string().min(6) : z.string().min(0)
            })
            .safeParse({ firstName, email, password });
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
                const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);
                let credit: any;
                let expire: any;
                setIsOnRunning(true);

                const userGroup = groups.find(group => group._id == groupId);
                if (userGroup) {
                    credit = userGroup.creditLimit;
                    expire = userGroup.expireDate
                }
                credit = parseInt(creditLimit) || credit;
                expire = expireDate || expire;

                const result = await createUser(
                    title || undefined,
                    firstName,
                    lastName || undefined,
                    firstName + " " + lastName,
                    email,
                    gender,
                    birthday || undefined,
                    company || undefined,
                    department || undefined,
                    position || undefined,
                    parseInt(rank) || undefined,
                    location || undefined,
                    team || undefined,
                    employeeId || undefined,
                    bio || undefined,
                    phoneNumber || undefined,
                    mobileNumber || undefined,
                    lineId || undefined,
                    groupId || undefined,
                    hashedPassword,
                    salt,
                    expire,
                    credit
                );

                if (result.resultCode !== ResultCode.UserCreated) throw new Error();

                setUpdateFlag((flag: any) => !flag);
                setPageState(0);

                toast.success('Successfully created the user');

                await inviteUser({ _id: result.id, email: email });
            }
            else if (state == 2) { //update a user
                if (!user) return;
                let credit: any;
                let expire: any;
                setIsOnRunning(true);

                const userGroup = groups.find(group => group._id == groupId);
                if (userGroup) {
                    credit = userGroup.creditLimit;
                    expire = userGroup.expireDate
                }
                credit = parseInt(creditLimit) || credit;
                expire = expireDate || expire;

                const res = await updateUser(user._id, {
                    title,
                    firstName,
                    lastName,
                    name: firstName + " " + lastName,
                    email,
                    gender,
                    dateOfBirth: birthday,
                    company: company || undefined,
                    department: department || undefined,
                    position: position || undefined,
                    rank: parseInt(rank) || undefined,
                    location: location || undefined,
                    team: team || undefined,
                    employeeId: employeeId || undefined,
                    bio: bio || undefined,
                    phoneNumber: phoneNumber || undefined,
                    mobileNumber: mobileNumber || undefined,
                    lineId: lineId || undefined,
                    groupId: groupId,
                    password: password || undefined,
                    expireDate: expire,
                    creditLimit: credit
                });
                if (!res.success) {
                    setErrorMsg('Failed!');
                }
                setIsOnRunning(false);
                setUpdateFlag((flag: any) => !flag);
                setPageState(0);

                toast.success('Successfully updated the user');
            }   
        }
        catch (err: any) {
            setIsOnRunning(false);
            setErrorMsg('User Registeration Failed!');
        }
    }
    return (
        <>{isExistGroups && <Dialog {...props} onOpenChange={() => setPageState(0)}>
            <DialogContent style={{ minWidth: '400px', maxHeight: '500px', overflow: 'auto' }}>
                <div className='text-gray-800 dark:text-white text-left text-sm'>
                    <div>
                        <h2 data-element-id="prompt-library-modal-title" className="text-center text-2xl font-bold text-gray-800 dark:text-white">
                            {state == 1 ? 'Add New User' : 'Update User'}
                        </h2>

                        <div className='mt-4'>
                            <div className='-mt-2 mb-4'>
                                <div className='w-full flex gap-4'>
                                    <div className='w-[150px]'>
                                        <span>Title: </span>
                                        <input type="text" placeholder="Enter title" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                            value={title} onChange={(e) => { setTitle(e.currentTarget.value) }} />
                                    </div>
                                    <div className='grow'>
                                        <span>First Name: </span>
                                        <input type="text" placeholder="Enter first name" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                            value={firstName} onChange={(e) => { setFirstName(e.currentTarget.value) }} />
                                    </div>
                                    <div className='grow'>
                                        <span>Last Name: </span>
                                        <input type="text" placeholder="Enter last name" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                            value={lastName} onChange={(e) => { setLastName(e.currentTarget.value) }} />
                                    </div>
                                </div>
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
                            <div className='-mt-2 mb-4'>
                                <span>Gender: </span>
                                <div className='flex gap-4 py-1'>
                                    <div
                                        className='flex items-center gap-1'
                                        onClick={() => setGender('male')}
                                    >
                                        <Input type="radio" name={"genderRadioGroup"} checked={gender == 'male'} readOnly/>
                                        <label>Male</label>
                                    </div>
                                    <div
                                        className='flex items-center gap-1 hover:cursor-pointer'
                                        onClick={() => setGender('female')}
                                    >
                                        <Input type="radio" name={"genderRadioGroup"} checked={gender == 'female'} readOnly/>
                                        <label>Female</label>
                                    </div>
                                </div>
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Brithday:<br/></span>
                                <DatePicker
                                    className='border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800'
                                    selected={birthday}
                                    onChange={(date) => setBirthday(date)}
                                />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Company: </span>
                                <input type="text" placeholder="Enter company" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={company} onChange={(e) => { setComapny(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Department: </span>
                                <input type="text" placeholder="Enter department" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={department} onChange={(e) => { setDepartment(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Position: </span>
                                <input type="text" placeholder="Enter company" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={position} onChange={(e) => { setPosition(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Rank: </span>
                                <input type="text" placeholder="Enter rank" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={rank} onChange={(e) => { setRank(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Location: </span>
                                <input type="text" placeholder="Enter location" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={location} onChange={(e) => { setLocation(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Team: </span>
                                <input type="text" placeholder="Enter team" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={team} onChange={(e) => { setTeam(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Employee Id: </span>
                                <input type="text" placeholder="Enter employee id" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={employeeId} onChange={(e) => { setEmployeeId(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Personal Info: </span>
                                <Textarea placeholder="Enter personal info" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={bio} onChange={(e) => { setBio(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Telephone Number: </span>
                                <input type="text" placeholder="Enter telephone number" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={phoneNumber} onChange={(e) => { setPhoneNumber(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Mobile Phone Number: </span>
                                <input type="text" placeholder="Enter mobile phone number" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={mobileNumber} onChange={(e) => { setMobileNumber(e.currentTarget.value); }} />
                            </div>
                            <div className='-mt-2 mb-4'>
                                <span>Line ID: </span>
                                <input type="text" placeholder="Enter line id" className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 dark:bg-zinc-800"
                                    value={lineId} onChange={(e) => { setLineId(e.currentTarget.value); }} />
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
