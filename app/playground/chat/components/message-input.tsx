import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SelectMessage } from "@/db/schema/messages";
import { cn } from "@/lib/utils";

export default function MessageInput({
  messages,
}: {
  messages: SelectMessage[];
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {messages?.map((msg) => (
        <div
          key={msg.id}
          className={cn(msg.role === "user" ? "self-end" : "self-end")}
        >
          <Markdown remarkPlugins={[remarkGfm]}>{msg.text}</Markdown>
        </div>
      ))}
    </div>
  );
}
