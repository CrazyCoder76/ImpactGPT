import { streamText, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google'
import Agent from '@/models/Agent';
import Usage from '@/models/Usage'
// import dbConnect from '@/lib/db/mongoose';
// import User from '@/models/User';
const encoder = new TextEncoder()
const MESSAGE_LIMIT = 3;
const TIME_WINDOW = 60 * 60 * 1000;

export async function POST(req: Request) {
  const data = await req.json();
  const { messages, agentId, modelName, userId } = data;

  const now = Date.now()
  const usage = await Usage.find({ userId, timestamp: { $gte: now - TIME_WINDOW } });
  const messageCount = usage.reduce((count, entry) => count + entry.messageCount, 0);

  if (messageCount + messages.length > MESSAGE_LIMIT) {
    return new Response(JSON.stringify({ error: 'Usage limit exceeded' }), { status: 429 });
  }

  // let agent;
  // if (agentId != 'default') agent = await Agent.findById(agentId);
  // let system = '';
  // if (agent) system = agent.description;
  // else system = 'You are a helpful chatbot.';
  // console.log(`****************** generting ai response ***********`);
  // console.log(`system: ${system}`);
  // console.log(`messages: ${messages}`);
  // let model;
  // switch (modelName) {
  //     case 'gpt-4-turbo':
  //         model = openai('gpt-4-turbo');
  //         break;
  //     case 'gpt-3.5-turbo':
  //         model = openai('gpt-3.5-turbo');
  //         break;
  //     case 'gemini-1.5-flash':
  //         model = google('models/gemini-pro')
  //         break;
  //     case 'claude-3-haiku':
  //         model = anthropic('claude-3-haiku-20240307');
  //         break;
  //     default:
  //         model = openai('gpt-3.5-turbo');
  //         break;
  // }
  // const result = await streamText({
  //     model: model,
  //     maxTokens: 1024,
  //     system: system,
  //     messages: messages
  // });
  // const iterator = makeIterator(result.textStream);
  const iterator = makeIterator();
  const stream = iteratorToStream(iterator);
  return new Response(stream)
}
async function* makeIterator(stream?: any) {
  // for await (const chunk of stream) {
  //     yield encoder.encode(chunk);
  // }
  await sleep(100);
  yield encoder.encode('Hello! ');
  await sleep(300);
  yield encoder.encode('This is the');
  await sleep(300);
  yield encoder.encode(' reponse for a test. ');
  await sleep(300);
  yield encoder.encode("After a test, ");
  await sleep(300);
  yield encoder.encode("There will be");
  await sleep(300);
  yield encoder.encode(" a real response.");
}
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next()
      if (done) {
        controller.close()
      } else {
        controller.enqueue(value)
      }
    },
  })
}
function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
// for await (const textPart of result.textStream) {
//     console.log(textPart);
// }
// messages: [
//   {
//     role: 'user',
//     content: 'Hello!',
//   },
//   {
//     role: 'assistant',
//     content: 'Hello! How can I help you today?',
//   },
//   {
//     role: 'user',
//     content: 'what is react?',
//   },
// ],