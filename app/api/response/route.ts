import { streamText, generateText } from 'ai'
import OpenAI from 'openai'

import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createAzure } from '@ai-sdk/azure'
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock'
import { createVertex } from '@ai-sdk/google-vertex'
import { GoogleAuth } from 'google-auth-library'
import { v4 as uuidv4 } from 'uuid'

import Agent from '@/models/Agent'
import { getApiKeyByModelId } from '@/actions/api_key'
import { getModelByModelId, getModelFullInfoByModelId } from '@/app/admin/models/action'

const encoder = new TextEncoder()

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { messages, agentId, modelId } = data
    let res,
      agent,
      system = ''

    if (agentId != 'default' && agentId != '') agent = await Agent.findById(agentId)
    if (agent) system = agent.instruction
    else system = 'You are a helpful assistant.'

    res = await getModelFullInfoByModelId(modelId)
    if (res.status == 'error') return
    const modelInfo = res.model

    if (modelInfo?.isCustomModel == false) {
      let model
      res = await getApiKeyByModelId(modelId)
      const apiKey = res?.key || ''

      console.log(modelId)
      switch (modelId) {
        case 'gpt-4-turbo':
          model = createOpenAI({ apiKey })('gpt-4-turbo')
          break
        case 'gpt-3.5-turbo':
          model = createOpenAI({ apiKey })('gpt-3.5-turbo')
          break
        case 'models/gemini-pro':
          model = createGoogleGenerativeAI({ apiKey })('models/gemini-pro')
          break
        case 'claude-3-haiku-20240307':
          model = createAnthropic({ apiKey })('claude-3-haiku-20240307')
          break
        default:
          model = createOpenAI({ apiKey })('gpt-3.5-turbo')
          break
      }

      const result = await streamText({
        model: model,
        maxTokens: 1024,
        system: system,
        messages: messages
      })
      const iterator = makeIterator(result.textStream)

      const stream = iteratorToStream(iterator)

      return new Response(stream)
    } else {
      // Custom Model

      // Get Custom headers
      const headers: { [key: string]: string } = {}
      // console.log(messages);
      // console.log(modelInfo?.endpoint, modelInfo?.modelId, modelInfo?.headers);
      if (modelInfo?.headers && modelInfo.headers instanceof Map) {
        modelInfo.headers.forEach((value: string, key: string) => {
          headers[key] = value
        })
      }

      let model
      if (modelInfo?.modelType == 'openai compatible') {
        let endpoint = ''
        if (modelInfo?.endpoint) {
          endpoint = modelInfo.endpoint.replace('/chat/completions', '')
        }
        const openai = new OpenAI({
          baseURL: endpoint,
          defaultHeaders: headers
        })

        const stream = await openai.chat.completions.create(
          {
            model: modelInfo?.modelId || '',
            messages: [
              {
                role: 'system',
                content: system
              },
              ...messages
            ],
            stream: true
          },
          {
            timeout: 4000
          }
        )
        const iterator = makeIterator2(stream)
        return new Response(iteratorToStream(iterator))
      }
      if (modelInfo?.modelType === 'azure openai') {
        // Azure OpenAI
        const regex =
          /https:\/\/(.+?)\.openai\.azure\.com\/openai\/deployments\/(.+?)\/chat\/completions\?api-version=\d{4}-\d{2}-\d{2}-preview/
        const match = (modelInfo.endpoint || '').match(regex)
        if (!match) throw new Error('Endpoint format is not incorrect')
        const resourceName = match[1]
        const deploymentName = match[2]

        const apiKey = headers['api-key'] || ''

        const azure = createAzure({
          resourceName: resourceName, // Azure resource name
          apiKey: apiKey
        })
        model = azure(deploymentName)
      } else if (modelInfo?.modelType === 'amazon bedrock') {
        // AWS Bedrock
        const region = headers['region'] || ''
        const accessKeyId = headers['access-key-id'] || ''
        const secretAccessKey = headers['secret-access-key'] || ''

        const bedrock = createAmazonBedrock({
          region: region,
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey
        })
        model = bedrock(modelId)
      } else if (modelInfo?.modelType === 'google vertex') {
        // Google Vertex
        const projectId = headers['project-id'] || ''
        const locationId = headers['location-id'] || ''

        const auth = new GoogleAuth({
          keyFilename: `././db_json/${headers['key-file-name']}`
        })
        const vertex = createVertex({
          project: projectId, // optional
          location: locationId, // optional
          // @ts-ignore
          googleAuthOptions: auth
        })

        model = vertex(modelId)
      }

      if (!model) throw new Error('model not found!')

      const result = await streamText({
        model: model,
        maxTokens: modelInfo?.contextSize,
        system: system,
        messages: messages
      })
      const iterator = makeIterator(result.textStream)

      const stream = iteratorToStream(iterator)

      return new Response(stream)
    }
  } catch (err: any) {
    console.log(err.toString())
  }
}

async function* makeIterator(stream?: any) {
  for await (const chunk of stream) {
    yield encoder.encode(chunk)
  }
}

async function* makeIterator2(stream?: any) {
  for await (const chunk of stream) {
    yield encoder.encode(chunk.choices[0]?.delta?.content || '')
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
    }
  })
}
