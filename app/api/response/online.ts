import { streamText, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { google } from '@ai-sdk/google'
import Agent from '@/models/Agent';

const encoder = new TextEncoder()

export async function POST(req: Request) {
    const data = await req.json();
    const { messages, agentId, modelName } = data;

    let agent;
    if (agentId != 'default') agent = await Agent.findById(agentId);
    let system = '';
    if (agent) system = agent.description;
    else system = 'You are a helpful chatbot.';
    let model;
    switch (modelName) {
        case 'gpt-4-turbo':
            model = openai('gpt-4-turbo');
            break;
        case 'gpt-3.5-turbo':
            model = openai('gpt-3.5-turbo');
            break;
        case 'gemini-1.5-flash':
            model = google('models/gemini-pro')
            break;
        case 'claude-3-haiku':
            model = anthropic('claude-3-haiku-20240307');
            break;
        default:
            model = openai('gpt-3.5-turbo');
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
async function* makeIterator(stream?: any) {
    for await (const chunk of stream) {
        yield encoder.encode(chunk);
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