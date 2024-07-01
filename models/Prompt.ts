// models/user-model.ts

import mongoose from 'mongoose';
import { Prompt } from '@/lib/types';

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

const PromptSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    prompt: {
        type: String,
        required: true
    },
    ownerId: {
        type: String,
        required: true
    },
});


export default mongoose.models.Prompt || mongoose.model<Prompt>('Prompt', PromptSchema);