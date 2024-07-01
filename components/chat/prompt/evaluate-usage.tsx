'use server'

import Usage from '@/models/Usage'
const MESSAGE_LIMIT = 3;
const TIME_WINDOW = 60 * 1000;

export async function evaluateUsage(payload: any) {
  const { modelId, userId } = payload;

  const now = Date.now();
  const usage = await Usage.findOne({ userId, modelId, timestamp: { $gte: now - TIME_WINDOW } });

  let messageCount;
  if (usage) {
    messageCount = usage?.messageCount + 1;
    if (messageCount <= MESSAGE_LIMIT) {
      await Usage.findOneAndUpdate(
        { userId, modelId },
        { $inc: { messageCount: 1 } },
        { new: true }
      );
    }
  } else {
    messageCount = 1
    const matchedUsage = await Usage.findOne({ userId, modelId });
    if (matchedUsage) {
      await Usage.findOneAndUpdate(
        { userId, modelId },
        {
          $set: { timestamp: now, messageCount: 1 },
        },
        { new: true }
      );
    } else {
      await Usage.create({ userId, modelId, timestamp: now, messageCount: 1 });
    }
  }

  if (messageCount > MESSAGE_LIMIT) {
    return true;
  }
  return false;
}