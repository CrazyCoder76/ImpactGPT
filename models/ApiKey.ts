import mongoose from "mongoose";
import { ApiKey } from "@/lib/types";

const ApiKeySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
    },
}, {
    collection: 'api_keys'  // Set the collection name
})

export default mongoose.models.ApiKey || mongoose.model<ApiKey>('ApiKey', ApiKeySchema);