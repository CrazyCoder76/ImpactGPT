import { streamText } from 'ai';
import OpenAI from 'openai';

import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import Agent from '@/models/Agent';
import { getApiKeyByModelId } from '@/actions/api_key';
import { getModelByModelId, getModelFullInfoByModelId } from '@/app/admin/models/action';

const encoder = new TextEncoder()

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { messages, agentId, modelId } = data;
    let res, agent, system = '';

    if (agentId != 'default' && agentId != '') agent = await Agent.findById(agentId);
    if (agent) system = agent.instruction;
    else system = 'You are a helpful assistant.';

    res = await getModelFullInfoByModelId(modelId);
    if (res.status == 'error') return;
    const modelInfo = res.model;

    if (modelInfo?.isCustomModel == false) {

      let model;
      res = await getApiKeyByModelId(modelId);
      const apiKey = res?.key || '';

      switch (modelId) {
        case 'gpt-4-turbo':
          model = createOpenAI({ apiKey })('gpt-4-turbo');
          break;
        case 'gpt-3.5-turbo':
          model = createOpenAI({ apiKey })('gpt-3.5-turbo');
          break;
        case 'models/gemini-pro':
          model = createGoogleGenerativeAI({ apiKey })('models/gemini-pro');
          break;
        case 'claude-3-haiku-20240307':
          model = createAnthropic({ apiKey })('claude-3-haiku-20240307');
          break;
        default:
          model = createOpenAI({ apiKey })('gpt-3.5-turbo');
          break;
      }

      const result = await streamText({
        model: model,
        maxTokens: 1024,
        system: system,
        messages: messages
      });
      const iterator = makeIterator(result.textStream);

      const stream = iteratorToStream(iterator);

      return new Response(stream)
    }
    else {
      const headers: { [key: string]: string } = {};
      console.log(messages);
      console.log(modelInfo?.endpoint, modelInfo?.modelId, modelInfo?.headers);
      if (modelInfo?.headers) {
        modelInfo.headers.forEach((value: string, key: string) => {
          headers[key] = value;
        });
      }
      const openai = new OpenAI({
        baseURL: modelInfo?.endpoint || '',
        apiKey: '',
        defaultHeaders: headers
      })

      const stream = await openai.chat.completions.create({
        model: modelInfo?.modelId || '',
        messages: [
          {
            role: 'system',
            content: system
          },
          ...messages],
        stream: true,
      }, {
        timeout: 4000
      })
      const iterator = makeIterator2(stream);
      return new Response(iteratorToStream(iterator));

    }
  }
  catch (err: any) {
    console.log(err.toString());
  }
}


async function* makeIterator(stream?: any) {
  for await (const chunk of stream) {
    yield encoder.encode(chunk);
  }
}

async function* makeIterator2(stream?: any) {
  for await (const chunk of stream) {
    yield encoder.encode(chunk.choices[0]?.delta?.content || "");
  }
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