import { create } from 'zustand';

// Assuming you have the Agent type defined somewhere
import { Session, Agent, GPTModel, Prompt } from '@/lib/types';

//State for Chat
interface StoreState {
  currentUser?: Session,
  setCurrentUser: (user: Session | undefined) => void,
  selectedAgent?: Agent;
  setSelectedAgent: (agent: Agent | undefined) => void;
  selectedChatId?: string,
  setSelectedChatId: (chatId: string | undefined) => void;
  currentModel?: GPTModel;
  setCurrentModel: (model: GPTModel) => void;
  newChatId: string;
  setNewChatId: (id: string) => void;
  input: string,
  setInput: (_: string) => void;
}

const useStore = create<StoreState>((set) => ({
  currentUser: undefined,
  setCurrentUser: (user: Session | undefined) => set({ currentUser: user }),
  selectedAgent: undefined,
  setSelectedAgent: (agent: Agent | undefined) => set({ selectedAgent: agent }),
  selectedChatId: undefined,
  setSelectedChatId: (chatId: string | undefined) => set({ selectedChatId: chatId }),
  currentModel: undefined,
  setCurrentModel: (model: GPTModel) => set({ currentModel: model }),
  newChatId: '',
  setNewChatId: (id: string) => set({ newChatId: id }),
  input: '',
  setInput: (input: string) => set({ input: input })
}));

export const usePromptPanelStore = create<PromptPanelState>((set) => ({
  isUpdatingPrompt: false,
  isAddingPrompt: false,
  promptOnUpdating: undefined,
  onUsePromptHandler: undefined,

  setIsUpdatingPrompt: (flag: boolean) => set({ isUpdatingPrompt: flag }),
  setIsAddingPrompt: (flag: boolean) => set({ isAddingPrompt: flag }),
  setPromptOnUpdating: (prompt: Prompt) => set({ promptOnUpdating: prompt }),
  setOnUsePromptHandler: (handler: any) => set({ onUsePromptHandler: handler })
}));

interface PromptPanelState {
  isUpdatingPrompt: boolean;
  isAddingPrompt: boolean;
  promptOnUpdating?: Prompt;
  onUsePromptHandler: any,

  setIsUpdatingPrompt: (flag: boolean) => void;
  setIsAddingPrompt: (flag: boolean) => void;
  setPromptOnUpdating: (prompt: Prompt) => void;
  setOnUsePromptHandler: (hadler: any) => void;
}

export default useStore;