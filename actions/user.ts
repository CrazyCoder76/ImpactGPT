"use server"

import { ResultCode, getStringFromBuffer } from '@/lib/utils';
import dbConnect from '@/lib/db/mongoose';
import UserModel from '@/models/User';
import { User } from '@/lib/types';
// import { findGroupById } from './group';

export async function getUserByEmail(email: string) {
    try {
        await dbConnect();
        const user = await UserModel.findOne({ email: email });
        return user;
    }
    catch (err: any) {
        return null;
    }
}

export async function createUser(
    username: string,
    email: string,
    groupId: string,
    hashedPassword: string,
    salt: string,
    invited?: boolean
) {
    try {
        await dbConnect();
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return {
                type: 'error',
                resultCode: ResultCode.UserAlreadyExists
            }
        } else {
            const new_user = new UserModel({
                name: username,
                email,
                groupId: groupId,
                password: hashedPassword,
                role: 1,
                salt,
                invited
            });
            await new_user.save();
            return {
                type: 'success',
                resultCode: ResultCode.UserCreated
            }
        }
    }
    catch (err: any) {
        return {
            type: 'error',
            resultCode: ResultCode.UnknownError
        }
    }
}

export async function getAllUsers() {
    try {
        await dbConnect();
        const users = await UserModel.find({}, { password: 0, salt: 0 });
        const serialized_users: User[] = users.map((user: User, index: number) => {
            // const group = await findGroupById(user.groupId)
            return {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
                groupId: user.groupId,
                invited: user.invited || undefined
            }
        });
        return serialized_users;
    }
    catch (err: any) {
        return [];
    }
}

export async function updateUser(id: string, payload: {
    name: string,
    email: string,
    password: string,
    groupId: string
}) {
    try {
        await dbConnect();
        const encoder = new TextEncoder()
        const salt = crypto.randomUUID();
        const saltedPassword = encoder.encode(payload.password + salt);
        const hashedPasswordBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);
        const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);

        if (payload.password.length > 0)
            await UserModel.findByIdAndUpdate(id, {
                name: payload.name,
                email: payload.email,
                groupId: payload.groupId,
                password: hashedPassword,
                salt: salt
            });
        else {
            await UserModel.findByIdAndUpdate(id, {
                name: payload.name,
                email: payload.email,
                groupId: payload.groupId,
            });
        }
        return {
            success: true
        }
    }
    catch (err: any) {
        return {
            success: false,
            message: err.toString()
        };
    }
}

export async function getUserById(id: string) {
    try {
        await dbConnect();
        const user = await UserModel.findById(id);
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            groupName: user.groupName,
            invited: user.invited || undefined
        }
    }
    catch (err: any) {
        return null;
    }
}

export async function deleteUserById(id: string) {
    try {
        await dbConnect();
        await UserModel.findOneAndDelete({ _id: id });
        return {
            success: true,
        }
    }
    catch (err: any) {
        return {
            success: false,
            messsage: err.toString()
        }
    }
}