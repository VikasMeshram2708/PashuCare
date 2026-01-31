"use client";

import { useChatStore } from "@/app/(context)/chat-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

export default function ActiveChatInput({ id }: { id: string }) {
  const router = useRouter();
  const { chat } = useChatStore();

  const [value, setValue] = useState("");

  const hasLoggedRef = useRef(false);

  const activeChatId = id === chat.chatId;

  // Redirect safely
  useEffect(() => {
    if (!activeChatId) {
      router.push("/chat");
    }
  }, [activeChatId, router]);

  // Log ONLY once per activation (even in Strict Mode)
  useEffect(() => {
    if (!activeChatId) return;
    if (hasLoggedRef.current) return;

    console.log("id", chat);
    hasLoggedRef.current = true;
  }, [activeChatId, chat]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value.trim()) return;
    setValue("");
  }

  return (
    <section className="w-full bg-background">
      {/* <pre>{JSON.stringify(chat, null, 2)}</pre> */}

      <form
        onSubmit={onSubmit}
        className="
          mx-auto flex max-w-3xl items-end gap-2
          rounded-xl border p-2
          focus-within:ring-1 focus-within:ring-primary
        "
      >
        <Textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder="Ask anything"
          className="min-h-10 resize-none border-0 p-2 leading-5 focus-visible:ring-0"
        />

        <Button
          type="submit"
          size="icon"
          disabled={!value.trim()}
          className="h-10 w-10 shrink-0 rounded-lg"
        >
          <SendIcon className="h-4 w-4" />
        </Button>
      </form>
    </section>
  );
}
