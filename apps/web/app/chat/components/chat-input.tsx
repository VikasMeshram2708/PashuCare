"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ChatInput() {
  const router = useRouter();
  const [value, setValue] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value.trim()) return;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: value }),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json?.errors ?? json?.message ?? "Failed");
        return;
      }
      console.log("json", json);
      const chatId = json?.metadata?.data;

      console.log("chatid", chatId);
      router.replace(`/chat/${chatId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setValue("");
    }
  }

  return (
    <section className="w-full bg-background">
      <form
        onSubmit={onSubmit}
        className="
          mx-auto flex max-w-3xl items-end gap-2
          rounded-xl border p-2
          focus-within:ring-1 focus-within:ring-primary
        "
      >
        {/* Textarea */}
        <Textarea
          rows={1}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder="Ask anything"
          className="min-h-10 resize-none border-0 p-2 leading-5 focus-visible:ring-0
          "
        />

        {/* Send button */}
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
