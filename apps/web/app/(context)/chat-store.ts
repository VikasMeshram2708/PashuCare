import { create } from "zustand";

type Chat = {
  text: string;
  chatId: string;
};
type ChatStore = {
  chat: Chat;
  createNewChat: (text: string) => string;
};
export const useChatStore = create<ChatStore>((set) => ({
  chat: {
    chatId: "",
    text: "",
  },
  createNewChat: (text) => {
    const newId = crypto.randomUUID();
    set({
      chat: {
        chatId: newId,
        text,
      },
    });
    return newId;
  },
}));
