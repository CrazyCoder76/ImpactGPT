'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth, signOut } from '@/auth'
import { type Chat } from '@/lib/types'
import dbConnect from '@/lib/db/mongoose';
import ChatModel from '@/models/Chat'

export async function getChatList() {
  try {
    dbConnect();
    const session = await auth()
    if (!session?.user?.id) {
      return [];
    }
    const userId = session?.user?.id;

    let chats = await ChatModel.find({ userId: userId },
      { _id: 0, chatId: 1, userId: 1, title: 1, overview: 1, agentId: 1, modelId: 1 }).lean();


    chats = chats.reverse();
    const data = chats.map((chat) => ({
      id: chat.chatId,
      userId: chat.userId,
      title: chat.title,
      overview: chat.overview,
      agentId: chat.agentId,
      modelId: chat.modelId,
      messages: chat.messages,
      isShared: chat.isShared,
      createdAt: chat.createdAt
    }));
    return data;
  }
  catch (err: any) {
    return [];
  }
}

export async function getSharedChat(id: string) {
  try {
    const chat = await ChatModel.findOne({ chatId: id });
    let messages = chat.messages.map((message: any, index: number) => ({
      role: message.role,
      content: message.content,
      date: message.date
    }));

    if (chat) {
      const data: Chat = {
        id: chat.chatId,
        userId: chat.userId,
        title: chat.title,
        overview: chat.overview,
        agentId: chat.agentId,
        messages: messages,
        modelId: chat.modelId,
        isShared: chat.isShared
      }
      return data;
    }
    return null;
  }
  catch (err: any) {
    return null;
  }
}

export async function getChat(id: string) {
  try {
    const chat = await ChatModel.findOne({ chatId: id });
    let messages = chat.messages.map((message: any, index: number) => ({
      role: message.role,
      content: message.content,
      date: message.date
    }));

    if (chat) {
      const data: Chat = {
        id: chat.chatId,
        userId: chat.userId,
        title: chat.title,
        overview: chat.overview,
        agentId: chat.agentId,
        messages: messages,
        modelId: chat.modelId,
        isShared: chat.isShared
      }
      return data;
    }
    return null;
  }
  catch (err: any) {
    return null;
  }
}

export async function saveChat(ai_state: any) {
  try {
    const session = await auth();
    if (session && session.user) {
      await dbConnect();
      const chatId = ai_state.chatId;
      let chat = await ChatModel.findOne({ chatId });
      if (chat) {
        chat.messages = ai_state.messages;
        await chat.save();
      }
      else {
        const new_chat = new ChatModel({
          chatId: chatId,
          userId: session.user.id,
          title: ai_state.messages[0].content.substring(0, 20),
          overview: ai_state.messages[1].content.substring(0, 50),
          messages: ai_state.messages,
          agentId: ai_state.agentId,
          modelId: ai_state.modelId
        });
        await new_chat.save();
      }
    }
  }
  catch (err: any) {
    console.log('saveChat****' + err.toString());
  }

}

export async function newChat() {
  redirect('/');
}

export async function shareChat(id: string) {
  try {
    await dbConnect();
    const chat = await ChatModel.findOneAndUpdate({ chatId: id }, { isShared: true });
    if (!chat) return { error: 'Somethign went wrong!' }
    const sharePath = `/share/${chat.chatId}`;
    return { sharePath: sharePath }
  }
  catch (err: any) {
    return { error: 'Something went wrong!' };
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}

export async function deleteChat(id: string) {
  try {
    const session = await auth();
    if (session && session.user) {
      const agent = await ChatModel.findOneAndDelete({ chatId: id });
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

export async function logout() {
  await signOut();
}