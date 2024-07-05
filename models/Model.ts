import mongoose from "mongoose";
import { GPTModel } from "@/lib/types";

const ModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  iconUrl: {
    type: String,
    // required: true
  },
  modelId: {
    type: String,
    required: true
  },
  contextSize: {
    type: Number,
    required: true
  },
  endpoint: {
    type: String,
  },
  headers: {
    type: Map
  },
  weight: {
    type: Number
  },
  isPinned: {
    type: Boolean,
    default: true
  },
  isCustomModel: {
    type: Boolean,
    required: true,
    default: false
  },
  modelType: {
    type: String,
    required: false
  },
})

export default mongoose.models.Model || mongoose.model<GPTModel>('Model', ModelSchema);