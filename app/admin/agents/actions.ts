'use server'

import { auth } from '@/auth';
import dbConnect from '@/lib/db/mongoose';
import AgentModel from '@/models/Agent';

import { Agent } from '@/lib/types';
import { CodeSandboxLogoIcon } from '@radix-ui/react-icons';


export async function getAgents() {
    try {
        const session = await auth();
        if (session && session.user) {
            await dbConnect();
            const agents = await AgentModel.find({});
            const serializedAgents: Agent[] = agents.map(agent => ({
                id: agent?.id.toString(),
                user: agent?.user,
                title: agent?.title,
                isPinned: agent?.isPinned,
                description: agent?.description,
                pictureUrl: agent?.pictureUrl,
                gptModel: agent?.gptModel,
                instruction: agent?.instruction,
                welcomeMsg: agent?.welcomeMsg,
                starters: agent?.starters
            }));
            return serializedAgents;
        }
        else return [];
    } catch (err: any) {
        console.log(err);
        return [];
    }
}

export async function getAgent(id: string) {
    try {
        await dbConnect();
        const agent = await AgentModel.findById(id);
        if (agent) {
            const data: Agent = {
                id: agent.id,
                title: agent?.title,
                isPinned: agent?.isPinned,
                description: agent?.description,
                pictureUrl: agent?.pictureUrl,
                gptModel: agent?.gptModel,
                instruction: agent?.instruction,
                welcomeMsg: agent?.welcomeMsg,
                starters: agent?.starters,
                ispinned: agent?.ispinned,
                assignedModel: agent?.assignedModel
            }
            return data;
        }
        else return null;
    }
    catch (err: any) {
        console.log(err);
        return null;
    }
}

export async function getAgentIconUrl(id: string) {
    try {
        await dbConnect();
        const agent = await AgentModel.findOne({ _id: id });
        if (agent) return agent.pictureUrl;
        else return '';
    }
    catch (err: any) {
        return '';
    }
}

export async function addAgent(agent: any) {
    try {
        const session = await auth();

        if (session && session.user) {
            await dbConnect();
            const new_agent = new AgentModel({
                user: session.user.id,
                title: agent.title,
                isPinned: agent.isPinned,
                description: agent.description,
                pictureUrl: agent.pictureUrl,
                gptModel: agent.gptModel,
                instruction: agent.instruction,
                welcomeMsg: agent.welcomeMsg,
                starters: agent.starters
            })
            const saved_agent = await new_agent.save();
            return {
                status: 200,
            }
        } else {
            return {
                status: 401
            }
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500
        };
    }
}

export async function updateAgent(agent: any) {
    try {
        const session = await auth();
        if (session && session.user) {
            await dbConnect();
            // console.log(agent);
            const updated_agent = await AgentModel.findOneAndUpdate({ _id: agent.id },
                {
                    id: agent.id.toString(),
                    user: agent.user,
                    title: agent.title,
                    isPinned: agent.isPinned,
                    description: agent.description,
                    pictureUrl: agent.pictureUrl,
                    gptModel: agent.gptModel,
                    instruction: agent.instruction,
                    welcomeMsg: agent.welcomeMsg,
                    starters: agent.starters
                });
            // console.log(updated_agent);
            await updated_agent.save();
            return {
                status: 200,
            }
        } else {
            return {
                status: 401
            }
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500
        }
    }
}

export async function deleteAgent(id: string) {
    try {
        const session = await auth();
        if (session && session.user) {
            const agent = await AgentModel.findOneAndDelete({ _id: id });
            return {
                status: 200
            };
        } else {
            return {
                status: 401
            };
        }
    } catch (err) {
        console.log(err);
        return {
            status: 500
        };
    }
}