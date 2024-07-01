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
  }
});

export default mongoose.models.Group || mongoose.model<Group>('Group', GroupSchema);