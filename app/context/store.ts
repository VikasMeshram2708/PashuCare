// stores/chat-store.ts
import { create } from "zustand";
import { SelectMessage } from "@/db/schema/messages";

type ChatState = {
  messagesByChat: Record<string, SelectMessage[]>;
  isLoading: boolean;
  fetchMessages: (chatId: string) => Promise<void>;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messagesByChat: {},
  isLoading: false,

  fetchMessages: async (chatId) => {
    const existing = get().messagesByChat[chatId];
    if (existing) return; // idempotent guard

    set({ isLoading: true });

    const res = await fetch(`/api/chat/${chatId}`);
    const json = await res.json();

    if (json.success) {
      set((state) => ({
        messagesByChat: {
          ...state.messagesByChat,
          [chatId]: json.metadata.messages ?? [],
        },
        isLoading: false,
      }));
    } else {
      set({ isLoading: false });
    }
  },
}));
