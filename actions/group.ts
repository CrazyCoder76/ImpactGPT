"use server"

import { ResultCode, removeUndefined } from '@/lib/utils';
import dbConnect from '@/lib/db/mongoose';
import GroupModel from '@/models/Group';
import { Group } from '@/lib/types';

export async function findGroupByName(name: string) {
    try {
        await dbConnect();
        const group = await GroupModel.findOne({ name: name });
        if (group)
            return {
                _id: group._id.toString(),
                name: group.name,
                description: group.description,
                expireDate: group.expireDate,
                creditLimit: group.creditLimit,
                status: group.status
            };
        else return null;
    }
    catch (err: any) {
        console.log(err.toString());
        return null;
    }
}
export async function findGroupById(id: string) {
    try {
        await dbConnect();
        const group = await GroupModel.findById(id);
        return {
            _id: group._id.toString(),
            name: group.name,
            description: group.description,
            expireDate: group.expireDate,
            creditLimit: group.creditLimit,
            status: group.status
        };
    }
    catch (err: any) {
        console.log(err.toString());
        return null;
    }
}

export async function getGroups() {
    try {
        await dbConnect();
        const groups = await GroupModel.find({});
        const serialized_groups: Group[] = groups.map((group) => ({
            _id: group._id.toString(),
            name: group.name,
            description: group.description,
            expireDate: group.expireDate,
            creditLimit: group.creditLimit,
            status: group.status
        }));

        return {
            status: 'success',
            data: serialized_groups
        }
    }
    catch (err: any) {
        return {
            status: 'error',
            data: []
        }
    }
}

export async function addNewGroup(name: string, description: string, expireDate: Date, creditLimit: Number) {
    try {
        dbConnect();
        const existing_group = await GroupModel.findOne({ name: name });
        if (existing_group) {
            return {
                status: 'error',
                msg: 'Duplicate Group Name!'
            };
        }
        const new_group = new GroupModel({
            name,
            description,
            expireDate,
            creditLimit,
            status: 'created'
        });
        await new_group.save();
        return { status: 'success' };
    }
    catch (err: any) {
        return { status: 'error', msg: 'Failed to create a new group!' };
    }
}

export async function updateGroup(id: string, payload: {
    name?: string,
    description?: string,
    expireDate?: Date,
    creditLimit?: Number,
    status?: string
}) {
    try {
        dbConnect();
        
        const cleanPayload = removeUndefined(payload);
        await GroupModel.findByIdAndUpdate(id,
            { $set: cleanPayload }
        );
        return { status: 'success' };
    }
    catch (err: any) {
        return { status: 'error', msg: 'Failed to update' };
    }
}

export async function deleteGroup(id: string) {
    try {
        dbConnect();
        await GroupModel.findByIdAndDelete(id);
        return { status: 'success' };
    }
    catch (err: any) {
        return {
            status: 'error',
            msg: 'Failed to delete'
        }
    }
}