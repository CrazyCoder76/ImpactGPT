"use server"

import fs from 'fs';
import path from 'path';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

import dbConnect from '@/lib/db/mongoose';
import ApiKeySchema from '@/models/ApiKey';
import { ApiKey } from '@/lib/types';
import { auth } from '@/auth';

export async function checkAPIKeysExists() {
    try {
        const session = await auth();
        if (session && session.user) {
            await dbConnect();
            const collectionExists = await ApiKeySchema.db.db.listCollections({ name: 'api_keys' }).hasNext();
            if (!collectionExists) {
                const filePath = path.join(process.cwd(), 'db_json', 'api_keys.json');
                const jsonData = fs.readFileSync(filePath, 'utf8');
                const apiKeys = JSON.parse(jsonData);
                await ApiKeySchema.insertMany(apiKeys);
            }
        }
    } catch (err) {
        console.error(err);
        return {
            status: 500
        }
    }
}

export async function getApiKeys() {
    try {
        await dbConnect();
        const api_keys = await ApiKeySchema.find({});
        const serialized_api_keys: ApiKey[] = api_keys.map((api_key) => {
            return {
                _id: api_key._id.toString(),
                name: api_key.name,
                key: api_key.key,
                placeholder: api_key.placeholder
            }
        });
        return {
            status: 'success',
            data: serialized_api_keys
        }
    }
    catch (err: any) {
        return {
            status: 'error'
        }
    }
}

export async function saveApiKey(id: string, key: string) {
    try {
        await dbConnect();
        await ApiKeySchema.findByIdAndUpdate(id, { key: key });
        return {
            status: 'success'
        }
    }
    catch (err: any) {
        return {
            status: 'error',
            msg: 'Failed to save Api Key'
        }
    }
}

export async function getApiKeyByModelId(modelId: string) {
    try {
        await dbConnect();
        let apiKey;
        if (modelId.includes('gpt')) {
            apiKey = await ApiKeySchema.findOne({ name: 'OpenAI' });
            if (apiKey) return {
                status: 'success',
                key: apiKey.key
            };
        }
        else if (modelId == 'models/gemini-pro') {
            apiKey = await ApiKeySchema.findOne({ name: 'Google Gemini' });
            if (apiKey) return {
                status: 'success',
                key: apiKey.key
            };
        }
        else if (modelId == 'claude-3-haiku-20240307') {
            apiKey = await ApiKeySchema.findOne({ name: 'Anthropic' });
            if (apiKey) return {
                status: 'success',
                key: apiKey.key
            };
        }
    }
    catch (err: any) {
        return {
            status: 'error',
            key: ''
        };
    }
}

export async function checkApiKey(name: string) {
    try {
        await dbConnect();
        const apiKey: ApiKey | null = await ApiKeySchema.findOne({ name }).lean();
        if (apiKey) {
            const key: string = apiKey.key;
            let model;
            switch (name) {
                case 'OpenAI':
                    model = createOpenAI({ apiKey: key })('gpt-3.5-turbo');
                    break;
                case 'Anthropic':
                    model = createAnthropic({ apiKey: key })('claude-3-haiku-20240307');
                    break;
                case 'Google Gemini':
                    model = createGoogleGenerativeAI({ apiKey: key })('models/gemini-pro');
                    break;
            }
            if (!model) return {
                status: 'error'
            };
            const { text } = await generateText({
                model: model,
                prompt: 'you are alive?'
            });
            if (text && text.length > 0) {
                return {
                    status: 'success'
                }
            }
            return {
                status: 'error'
            };
        }
        else {
            return {
                status: 'error'
            };
        }
    }
    catch (err: any) {
        return {
            status: 'error'
        }
    }
}