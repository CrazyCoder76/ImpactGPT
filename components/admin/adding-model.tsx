import * as React from 'react'
import OpenAI from 'openai'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { IconPlus, IconSpinner } from '@/components/ui/icons'
import { addModel, testModel, updateModel } from '@/app/admin/models/action'
import { GPTModel } from '@/lib/types'

type AddingModelType = {
  id: string,
  name: string,
  modelType: string,
  iconUrl: string,
  description: string,
  endPoint: string,
  modelId: string,
  contextLength: number,
  headers: { key: string, value: string }[],
  error: boolean,
  pending: boolean
}

type HeaderType = {
  key: string,
  value: string
}

type ModelHeaderFieldProps = {
  index: number,
  header: HeaderType,
  handleHeaderChange: (index: number, key: string, value: string) => void;
  removeHeader: () => void;
}

const initialModel: AddingModelType = {
  id: '',
  name: '',
  modelType: 'openai compatible',
  iconUrl: '',
  description: '',
  endPoint: '',
  modelId: '',
  contextLength: 2048,
  headers: [],
  error: false,
  pending: false
}

export function AddingModel({ backToMain, selectedModel }: React.ComponentProps<'div'> & {
  backToMain: () => void,
  selectedModel: GPTModel | null
}) {
  const [model, setModel] = React.useState<AddingModelType>(initialModel);
  const [isAddButtonActive, setIsAddButtonActive] = React.useState<Boolean>(false);
  const [isTesing, setIsTesting] = React.useState(false);

  const onModelChange = (e: React.ChangeEvent<any>) => {
    setModel({ ...model, [e.target.name]: e.target.value })
  }

  const onTestModel = async () => {
    try {
      setIsTesting(true);
      const headers: { [key: string]: string } = {};
      if (model.headers) {
        for (const header of model.headers) {
          headers[header.key] = header.value;
        }
      }
      const res = await testModel(model.endPoint, model.modelId, headers, model.modelType);
      setIsTesting(false);
      if (res.status == 'success') {
        setIsAddButtonActive(true);
        toast.success('Model is working!');
      }
      else {
        setIsAddButtonActive(false);
        toast.success('Model is not working!' + res.message);
      }
    }
    catch (err: any) {
      console.log(err.toString());
      setIsTesting(false);
      setIsAddButtonActive(false);
      toast.success('Model is not working!');
    }
  }

  const addHeader = () => {
    setModel(prevModel => ({
      ...prevModel,
      headers: [...prevModel.headers, { key: `x-header-key-${prevModel.headers.length + 1}`, value: 'Header Value' }]
    }));
  };

  const handleHeaderChange = (index: number, key: string, value: string) => {
    setModel(prevModel => {
      const newHeaders = [...prevModel.headers];
      newHeaders[index] = { key, value };
      return { ...prevModel, headers: newHeaders };
    });
  }

  const removeHeader = (index: number) => {
    setModel(prevModel => ({
      ...prevModel,
      headers: prevModel.headers.filter((_, i) => i !== index)
    }));
  }

  const handleAdd = async () => {
    if (model?.name.trim() === '' || model?.contextLength <= 0) {
      setModel({ ...model, error: true, pending: false })
    }
    else {
      setModel({ ...model, pending: true });
      if (!selectedModel || Object.keys(selectedModel).length === 0) {
        const headers: { [key: string]: string } = {};
        if (model.headers) {
          for (const header of model.headers) {
            headers[header.key] = header.value;
          }
        }
        console.log(`****** add ****`);
        const res = await addModel({
          name: model.name,
          iconUrl: model.iconUrl,
          description: model.description,
          endpoint: model.endPoint,
          modelId: model.modelId,
          contextSize: model.contextLength,
          headers: headers,
          modelType: model.modelType,
          isCustomModel: true
        });
        if (res?.status === 200) {
          setModel({ ...model, error: false, pending: false })
          window.location.reload();
        }
        else {
          setModel({ ...model, error: false, pending: false })
        }
      }
      else {
        const headers: { [key: string]: string } = {};
        if (model.headers) {
          for (const header of model.headers) {
            headers[header.key] = header.value;
          }
        }
        const res = await updateModel({
          id: model.id,
          name: model.name,
          iconUrl: model.iconUrl,
          description: model.description,
          endPoint: model.endPoint,
          modelId: model.modelId,
          contextLength: model.contextLength,
          headers: headers,
          modelType: model.modelType,
          error: false,
        });
        if (res?.status === 200) {
          setModel({ ...model, error: false, pending: false })
          window.location.reload()
        }
        else {
          setModel({ ...model, error: false, pending: false })
        }
      }
    }
  }

  React.useEffect(() => {
    if (selectedModel && Object.keys(selectedModel).length !== 0) {
      console.log(selectedModel);
      const plainHeaders = Object.entries(selectedModel.headers || {}).map(([key, value]) => ({ key, value }));
      setModel({ ...initialModel, ...selectedModel, headers: plainHeaders });
    }
  }, [selectedModel]);

  return <div>
    <div> {isTesing ? 'testing' : 'normal'}</div>
    <Button variant='default'
      className='text-blue-500 hover:underline inline-flex justify-center items-center font-semibold space-x-1 shrink-0 truncate px-2'
      onClick={backToMain}
    >
      <span>←</span>
      <span>Cancel</span>
    </Button>
    <div className='mt-6 [&>*]:bg-white'>
      <div className='bg-gray-100 dark:bg-gray-900 dark:border-gray-600 rounded-md shadow border-gray-200 border p-4 space-y-4'>
        <div className='p-3 dark:bg-gray-800 rounded-lg space-y-3 !mt-4 text-base md:p-4'>
          <div className='flex gap-2'>
            <div className='w-full'>
              <div className='flex items-center justify-between mb-1'>
                <label className='block font-medium leading-6'>Name</label>
              </div>
              <Input
                name='name'
                value={model.name}
                placeholder='e.g., GPT4All'
                onChange={onModelChange}
                className='text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 bg-white text-black'
              />
            </div>
            <div>
              <div className='flex items-center justify-between mb-1'>
                <label className='block font-medium leading-6'>Model Type</label>
              </div>
              <select
                value={model.modelType}
                defaultValue='openai compatible'
                onChange={(e) => { setModel({ ...model, modelType: e.target.value }); }}
                className="block w-fit rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 dark:text-white dark:bg-zinc-700 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
              >
                <option value='openai compatible'>OpenAI Compatible</option>
                <option value='amazon bedrock'>Amazon Bedrock</option>
                <option value='google vertex'>Google Vertex</option>
                <option value='azure openai'>Azure OpenAI</option>
              </select>
            </div>
          </div>
          <div>
            <div className='flex items-center justify-between mb-1'>
              <label className='block font-medium leading-6'>Icon URL (Optional)</label>
            </div>
            <Input
              name='iconUrl'
              value={model.iconUrl}
              onChange={onModelChange}
              placeholder='https://...'
              className='text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 bg-white text-black'
            />
          </div>
          <div>
            <div className='flex items-center justify-between mb-1'>
              <label className='block font-medium leading-6'>Description</label>
            </div>
            <Input
              name='description'
              value={model.description}
              onChange={onModelChange}
              placeholder='e.g., Suitable for simple creative writing tasks'
              className='text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 bg-white text-black'
            />
          </div>
          <div>
            <div className='flex items-center justify-between mb-1'>
              <label className='block font-medium leading-6'>Endpoint</label>
              <div className='text-xs text-right'>* Must be compatible with /v1/chat/completions</div>
            </div>
            <Input
              name='endPoint'
              value={model.endPoint}
              placeholder='http://localhost:8080/v1/chat/completions'
              onChange={onModelChange}
              className='text-sm w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 bg-white text-black'
            />
          </div>
          <div className='flex items-center justify-center gap-2'>
            <div className='w-full'>
              <div className='flex items-center justify-between mb-1'>
                <label className='block font-medium leading-6'>Model ID</label>
              </div>
              <Input
                name='modelId'
                value={model.modelId}
                placeholder='e.g., ggml-gpt4all-j-v1.3-groovy.bin'
                onChange={onModelChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 bg-white text-black'
              />
            </div>
            <div>
              <div className='flex items-center justify-between mb-1'>
                <label className="block font-medium leading-6">Context Length</label>
              </div>
              <Input
                name='contextLength'
                value={model?.contextLength}
                onChange={onModelChange}
                placeholder='e.g., 2048'
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 bg-white text-black'
              />
            </div>
          </div>
          <div className='space-y-2'>
            {
              model.headers.length > 0 && (
                <>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='block font-medium leading-6'>Custom Headers</span>
                  </div>
                  {
                    model.headers.map((header, index) => (
                      <ModelHeaderField
                        key={index}
                        index={index}
                        header={header}
                        handleHeaderChange={handleHeaderChange}
                        removeHeader={() => removeHeader(index)} />
                    ))
                  }
                </>
              )
            }
          </div>
          <div className='mt-2'>
            <Button className='text-blue-500 font-semibold flex items-center justify-center gap-1 hover:underline' onClick={addHeader}>
              <svg stroke='currentColor' fill='currentColor' strokeWidth={0} viewBox='0 0 448 512' className='size-4' width="1em" height="1em" xmlns='https://www.w3.org/2000/svg'>
                <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
              </svg>
              <span>Add Custom Headers</span>
            </Button>
          </div>
        </div>
        {model.error && <div className='flex justify-center'>
          <span className='text-sm text-red-500'>Name and Model Id and Context Length cannot be empty!</span>
        </div>}
        <hr />
        <div className='text-center flex items-center justify-center gap-2'>
          <Button disabled={isTesing} onClick={() => { onTestModel(); }} className='inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 gap-2'>
            {isTesing ? <IconSpinner /> : '⚡'}<span>Test</span>
          </Button>
          <Button className='inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 gap-2'
            onClick={handleAdd} disabled={!isAddButtonActive}>
            {model.pending ? <IconSpinner /> : <svg stroke='currentColor' fill='currentColor' strokeWidth={0} viewBox='0 0 1024 1024' className='size-4' width="1em" height="1em" xmlns='http://www.w3.org/2000/svg'>
              <path d='M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 0 0-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z'></path>
            </svg>}
            <span>Save</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
}

const ModelHeaderField: React.FC<ModelHeaderFieldProps> = ({ header, index, handleHeaderChange, removeHeader }) => {
  const [key, setKey] = React.useState(header.key);
  const [value, setValue] = React.useState(header.value);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setKey(newKey);
    handleHeaderChange(index, newKey, value);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    handleHeaderChange(index, key, newValue);
  };

  return (
    key === 'key-file-name' ? <></> :
      <div className='flex items-center justify-center gap-2'>
        <Input
          value={key}
          onChange={handleKeyChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black' />
        <Input
          value={value}
          onChange={handleValueChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black' />
        <Button className='text-red-500 font-semibold hover:underline' onClick={removeHeader}>
          Remove
        </Button>
      </div>
  );
};
