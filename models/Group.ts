// models/user-model.ts

import mongoose from 'mongoose';
import { Group } from '@/lib/types';

const GroupSchema = new mongoose.Schema<Group>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  expireDate: {
    type: Date,
  },
  creditLimit: {
    type: Number
  },
  status: {
    type: String
  }
});

export default mongoose.models.Group || mongoose.model<Group>('Group', GroupSchema);