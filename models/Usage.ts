import mongoose from 'mongoose'
import { Usage } from '@/lib/types'

const UsageSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  modelId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    requried: true
  },
  messageCount: {
    type: Number,
    requried: true
  }
})

export default mongoose.models.Usage || mongoose.model<Usage>('Usage', UsageSchema);