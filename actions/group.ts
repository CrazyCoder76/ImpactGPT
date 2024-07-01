"use server"

import { ResultCode } from '@/lib/utils';
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
                name: group.name
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
            name: group.name
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
            description: group.description
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

export async function addNewGroup(name: string, description: string) {
    try {
        dbConnect();
        const existing_group = await GroupModel.findOne({ name: name });
        if (existing_group) {
            return {
                status: 'error',
                msg: 'Duplicate Group Name!'
            };
        }
        const new_group = new GroupModel({ name: name, description: description });
        await new_group.save();
        return { status: 'success' };
    }
    catch (err: any) {
        return { status: 'error', msg: 'Failed to create a new group!' };
    }
}

export async function updateGroup(id: string, payload: Group) {
    try {
        dbConnect();
        await GroupModel.findByIdAndUpdate(id, {
            name: payload.name,
            description: payload.description
        });
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