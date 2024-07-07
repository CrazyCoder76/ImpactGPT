'use server'

import fs, { access } from 'fs';
import OpenAI from 'openai';
import { createAzure } from '@ai-sdk/azure';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { createVertex } from '@ai-sdk/google-vertex';
import { GoogleAuth } from 'google-auth-library';
import { generateText } from 'ai';

import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { auth } from '@/auth';
import dbConnect from '@/lib/db/mongoose'
import Model from "@/models/Model"
import { GPTModel } from '@/lib/types';
import { headers } from 'next/headers';


export async function checkModelsExists() {
  try {
    const session = await auth();
    if (session && session.user) {
      await dbConnect();
      const collectionExists = await Model.db.db.listCollections({ name: 'models' }).hasNext();
      if (!collectionExists) {
        const filePath = path.join(process.cwd(), 'db_json', 'models.json');
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const models = JSON.parse(jsonData);
        await Model.insertMany(models);
      }
    }
  } catch (err) {
    console.error(err);
    return {
      status: 500
    }
  }
}

export async function getModelIconUrlByModelId(modelId: string) {
  try {
    await dbConnect();
    const model = await Model.findOne({ modelId: modelId });
    if (model) {
      return model.iconUrl
    }
    else return '';
  }
  catch (err: any) {
    return '';
  }
}

export async function testModel(endpoint: string, modelId: string, headers: any, modelType: string) {
  let fileName = '';
  try {
    if (modelType == 'azure openai') {
      // OpenAI Azure Model
      /* https://RESOURCE_NAME.openai.azure.com/openai/deployments/DEPLOYMENT_NAME/chat/
        completions?api-version=2024-05-01-preview

        https://oleksii301.openai.azure.com/openai/deployments/ImpactChatV3gpt4o-deployment301/
          chat/completions?api-version=2024-02-15-preview
      */
      const regex = /https:\/\/(.+?)\.openai\.azure\.com\/openai\/deployments\/(.+?)\/chat\/completions\?api-version=\d{4}-\d{2}-\d{2}-preview/;
      const match = endpoint.match(regex);
      if (!match) throw new Error('Endpoint format is not incorrect');
      const resourceName = match[1];
      const deploymentName = match[2];

      const apiKey = headers['api-key'] || '';

      const azure = createAzure({
        resourceName: resourceName, // Azure resource name
        apiKey: apiKey,
      });
      const model = azure(deploymentName);
      const { text } = await generateText({
        model: model,
        prompt: 'Hi! who are you?',
      });
      console.log(`resposne from Azure: ${text}`);
    }
    else if (modelType == 'amazon bedrock') {
      // AWS Bedrock
      /**
       * bedrock.us-east-1.amazonaws.com
       */
      const region = headers['region'] || '';
      const accessKeyId = headers['access-key-id'] || '';
      const secretAccessKey = headers['secret-access-key'] || '';

      const bedrock = createAmazonBedrock({
        region: region,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      });
      const { text } = await generateText({
        model: bedrock(modelId),
        prompt: 'Hi! Who are you?'
      });
      console.log(`resposne from Bedrock: ${text}`);
    }
    else if (modelType == 'google vertex') {
      // Gcp Vertex AI
      /**
       * https://us-central1-aiplatform.googleapis.com
       */
      const projectId = headers['project-id'] || '';
      const locationId = headers['location-id'] || '';
      // Save private key as JSON file
      fileName = `${uuidv4()}.json`;
      fs.writeFileSync(`././db_json/${fileName}`, headers['private-key']);

      const auth = new GoogleAuth({
        keyFilename: `././db_json/${fileName}`
      });
      const vertex = createVertex({
        project: projectId, // optional
        location: locationId, // optional
        // @ts-ignore
        googleAuthOptions: auth
      });

      const { text } = await generateText({
        model: vertex(modelId),
        prompt: 'Hi! who are you?'
      });
      // fs.unlinkSync(`././db_json/${fileName}`);
      console.log(`resposne from Vertex: ${text}`);
    }
    else {
      // Other OpenAI Compatible Model
      endpoint = endpoint.replace('/chat/completions', '');
      console.log(endpoint);
      const openai = new OpenAI({
        baseURL: endpoint,
        apiKey: '',
        defaultHeaders: headers
      })
      const completion = await openai.chat.completions.create({
        model: modelId,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant."
          },
          {
            role: "user",
            content: "say a test"
          }
        ],
      }, {
        timeout: 5000
      })
    }
    return {
      status: 'success'
    }
  }
  catch (err: any) {
    console.log(err.toString());
    // if (modelType == 'google vertex') fs.unlinkSync(`././db_json/${fileName}`);
    return {
      status: 'error',
      message: err.toString()
    }
  }
}

export async function getModelByModelId(modelId: string) {
  try {
    await dbConnect();
    const model = await Model.findOne({ modelId: modelId });
    if (model) {
      return {
        status: 'success',
        model: {
          id: model._id.toString(),
          name: model.name,
          description: model.description,
          iconUrl: model.iconUrl,
          modelId: model.modelId,
        } as GPTModel
      }
    }
    else return {
      status: 'error'
    }
  }
  catch (err: any) {
    return {
      status: 'error'
    }
  }
}

export async function getModelFullInfoByModelId(modelId: string) {
  try {
    await dbConnect();
    const model = await Model.findOne({ modelId: modelId });
    if (model) {
      return {
        status: 'success',
        model: {
          id: model._id.toString(),
          name: model.name,
          description: model.description,
          iconUrl: model.iconUrl,
          modelId: model.modelId,
          isCustomModel: model.isCustomModel,
          endpoint: model.endpoint,
          headers: model.headers,
          modelType: model.modelType,
        } as GPTModel
      }
    }
    else return {
      status: 'error'
    }
  }
  catch (err: any) {
    return {
      status: 'error'
    }
  }
}

export async function getModels() {
  try {
    const session = await auth();
    if (session && session.user) {
      await dbConnect();
      const models = await Model.find({});
      const serializedModel: any[] = models.map(model => ({
        id: model._id.toString(),
        name: model.name,
        description: model.description,
        iconUrl: model.iconUrl,
        modelId: model.modelId,
        contextLength: model.contextSize,
        endPoint: model.endpoint,
        headers: Object.fromEntries(model.headers || []),
        weight: model?.weight,
        isPinned: model?.isPinned,
        isCustomModel: model?.isCustomModel,
        modelType: model.modelType
      }));
      serializedModel.sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
      return serializedModel;
    }
    else {
      return [];
    }
  } catch (err: any) {
    console.error(err);
    return [];
  }
}

export async function addModel(data: GPTModel) {
  try {
    const session = await auth();
    if (session && session.user) {
      await dbConnect();
      const models = await Model.find().sort({ weight: 1 });

      let headers: { [key: string]: string } = {};

      if (data?.isCustomModel == true) {
        if (data?.headers) {
          if (data.headers instanceof Map) { }
          else if (typeof data.headers === 'object') {
            headers = data.headers;
          }
        }
        if (data?.modelType == 'google vertex') {
          // Save private key as JSON file
          const fileName = `${uuidv4()}.json`;
          fs.writeFileSync(`././db_json/${fileName}`, headers['private-key']);
          headers['key-file-name'] = fileName;
        }
      }
      const model = new Model({
        name: data.name,
        description: data.description,
        iconUrl: data.iconUrl,
        modelId: data.modelId,
        contextSize: data.contextSize,
        endpoint: data?.endpoint || '',
        headers: headers,
        weight: models.length === 0 ? 100 : models[models.length - 1].weight + 100,
        isPinned: true,
        isCustomModel: true,
        modelType: data?.modelType || ''
      });

      await model.save();
      return {
        status: 200
      }
    }
  } catch (err) {
    console.log(err);
    return {
      status: 500
    };
  }
}

export async function updateModel(data: any) {
  try {
    const session = await auth();
    if (session && session.user) {
      await dbConnect();
      const updated_model = await Model.findOneAndUpdate({ _id: data.id },
        {
          name: data.name,
          description: data.description,
          iconUrl: data.iconUrl,
          modelId: data.modelId,
          contextSize: data.contextLength,
          endpoint: data.endpoint,
          headers: data.headers,
          weight: data.weight,
          isPinned: true,
          modelType: data.modelType,
          isCustomModel: true
        });
      await updated_model.save();
      return {
        status: 200,
      }
    } else {
      return {
        status: 401
      }
    }
  } catch (err) {
    console.log(err);
    return {
      status: 500
    }
  }
}

export async function deleteModel(id: string) {
  try {
    const session = await auth();
    if (session && session.user) {
      const model = await Model.findOneAndDelete({ _id: id });
      return {
        status: 200
      }
    } else {
      return {
        status: 401
      }
    }
  } catch (err) {
    console.error(err);
    return {
      status: 500
    }
  }
}