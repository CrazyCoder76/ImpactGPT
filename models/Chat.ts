// models/user-model.ts

import mongoose from 'mongoose';

// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

// export interface Conversation {
// //   name: string;
// //   email: string;
// //   password: string;
// //   role: Number;
// }

// export interface MongoUser extends Conversation, mongoose.Document {}

// export type TUser = User & {
//   _id: string;
//   createdAt: string;
//   updatedAt: string;
// };

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
    }
});

const ChatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    overview: {
        type: String,
        required: true
    },
    messages: [MessageSchema],
    agentId: {
        type: String,
        required: true,
        default: 'default'
    },
    modelId: {
        type: String,
        // required: true,
    },
    isShared: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
    }
});

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);