'use server'

import fs from 'fs';
import path from 'path';
import { auth } from '@/auth';
import dbConnect from '@/lib/db/mongoose'
import Model from "@/models/Model"
import { GPTModel } from '@/lib/types';
import OpenAI from 'openai';

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

export async function testModel(endpoint: string, modelId: string, headers: any) {
  try {
    const openai = new OpenAI({
      baseURL: endpoint,
      apiKey: '',
      defaultHeaders: headers
      // dangerouslyAllowBrowser: true,
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
    return {
      status: 'success'
    }
  }
  catch (err: any) {
    console.log(err.toString());
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
          headers: model.headers
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
        isCustomModel: model?.isCustomModel
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

export async function addModel(data: any) {
  try {
    const session = await auth();
    if (session && session.user) {
      await dbConnect();
      const models = await Model.find().sort({ weight: 1 });

      const model = new Model({
        name: data.name,
        description: data.description,
        iconUrl: data.iconUrl,
        modelId: data.modelId,
        contextSize: data.contextLength,
        endpoint: data.endPoint,
        headers: data.headers,
        weight: models.length === 0 ? 100 : models[models.length - 1].weight + 100,
        isPinned: true,
        isCustomModel: data.isCustomModel || true
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
          isCustomModel: data.isCustomModel || true
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