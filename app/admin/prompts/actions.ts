"use server"

import dbConnect from '@/lib/db/mongoose';
import { Prompt, Session } from '@/lib/types';
import PromptModel from '@/models/Prompt';
import { auth } from '@/auth'
import { random } from 'nanoid';
import { randomInt } from 'crypto';
import User from '@/models/User';

export async function addNewPrompt(data: Prompt) {
    try {
        const session = (await auth()) as Session;
        if (!session?.user) return { success: false, message: 'Unauthorized!' };

        await dbConnect();
        const userId = session.user.id;
        const prompt = new PromptModel({
            title: data.title,
            description: data.description,
            prompt: data.prompt,
            ownerId: userId
        });
        await prompt.save();
        return {
            success: true
        };
    }
    catch (err: any) {
        return {
            success: false,
            message: err.toString()
        };
    }
}

export async function getMyPrompts() {
    try {
        const session = (await auth()) as Session;
        let int = randomInt(100);
        if (!session?.user) return [];
        const user = await User.findById(session.user.id);
        if (!user) return [];

        let prompts = await PromptModel.find({ ownerId: user._id });
        const serialized_prompts: Prompt[] = prompts.map((prompt, index: number) => ({
            _id: prompt._id.toString(),
            title: prompt.title,
            description: prompt.description,
            prompt: prompt.prompt,
            ownerId: prompt.ownerId
        }));

        // Add Admin prompts if the user is a member.
        if (user.role != 0) {
            const admin = await User.findOne({ role: 0 });
            let prompts = await PromptModel.find({ ownerId: admin._id });
            prompts.forEach((prompt) => {
                serialized_prompts.push({
                    _id: prompt._id.toString(),
                    title: prompt.title,
                    description: prompt.description,
                    prompt: prompt.prompt,
                    ownerId: prompt.ownerId
                });
            })
        }
        console.log(serialized_prompts);
        return serialized_prompts;
    }
    catch (err: any) {
        return [];
    }
}

export async function updatePrompt(id: string, payload: Prompt) {
    try {
        dbConnect();
        console.log('***************** update prompt *************');
        console.log(payload);
        await PromptModel.findByIdAndUpdate(id, {
            title: payload.title,
            description: payload.description,
            prompt: payload.prompt
        });
        return {
            success: true
        };
    }
    catch (err: any) {
        return {
            success: false,
            message: 'Failed to update prompt'
        };
    }
}

export async function deletePromptById(id: string) {
    try {
        dbConnect();
        await PromptModel.findByIdAndDelete(id);
        return {
            success: true
        };
    }
    catch (err: any) {
        return {
            success: false,
            message: 'Failed to delete prompt'
        };
    }
}

export async function getCommunityPrompts() {
    try {
        const session = (await auth()) as Session;
        if (!session?.user.id) {
            return { success: false, message: 'Unauthorized!' };
        }

        const userId = session.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: 'User not found!' };
        }

        const members = await User.find({ groupId: user.groupId, _id: { $ne: userId } });

        if (!members.length) {
            return { success: false, message: 'No members found in the group!' };
        }

        const promptsPromises = members.map(member => PromptModel.find({ ownerId: member._id }));
        const promptsArrays = await Promise.all(promptsPromises);

        const prompts = promptsArrays.flat();

        const serialized_data: Prompt[] = prompts.map((prompt) => ({
            _id: prompt._id.toString(),
            title: prompt.title,
            description: prompt.description,
            prompt: prompt.prompt,
            ownerId: prompt.ownerId
        }));
        console.log(serialized_data);
        return {
            success: true,
            data: serialized_data
        }
    } catch (err: any) {
        return { success: false, message: 'Failed to fetch community prompts', error: err.message };
    }
}



