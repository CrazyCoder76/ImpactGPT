import mongoose from "mongoose";
import { Agent } from "@/lib/types";

const AgentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
    },
    pictureUrl: {
        type: String
    },
    gptModel: {
        type: String
    },
    instruction: {
        type: String,
        required: true
    },
    welcomeMsg: {
        type: String
    },
    starters: {
        type: [String],
        default: []
    }
})

export default mongoose.models.Agent || mongoose.model<Agent>('Agent', AgentSchema);