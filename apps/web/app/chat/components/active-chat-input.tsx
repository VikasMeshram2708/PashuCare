// components/active-chat-input.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Id } from "@/convex/_generated/dataModel";
import { SendIcon, StopCircleIcon } from "lucide-react";
import {
  FormEvent,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ActiveChatInputProps {
  id: Id<"chats">;
  userId: string;
  initialMessages?: Array<{
    _id?: Id<"messages">;
    role: "user" | "assistant" | "system";
    content: string;
    status?: "pending" | "streaming" | "sent" | "error";
    createdAt?: number;
  }>;
  autoTrigger?: boolean;
}

export default function ActiveChatInput({
  id,
  userId,
  initialMessages = [],
  autoTrigger = false,
}: ActiveChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingMessageId, setPendingMessageId] =
    useState<Id<"messages"> | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoTriggered = useRef(false);

  // Convex mutations
  const createMessage = useMutation(api.chats.createMessage);
  const updateMessage = useMutation(api.chats.updateMessage);

  // Memoize messages to prevent dependency issues
  const messages = useMemo(() => initialMessages, [initialMessages]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);

    if (pendingMessageId && streamingContent) {
      updateMessage({
        messageId: pendingMessageId,
        userId,
        content: streamingContent,
        status: "sent",
      });
    }

    setPendingMessageId(null);
    setStreamingContent("");
    textareaRef.current?.focus();
  }, [pendingMessageId, streamingContent, userId, updateMessage]);

  const sendMessage = useCallback(
    async (content: string, skipUserMessage = false) => {
      if (!content.trim()) return;

      setError(null);
      setIsStreaming(true);
      setStreamingContent("");

      try {
        // 1. Save user message to Convex (unless skipping for auto-trigger)
        if (!skipUserMessage) {
          await createMessage({
            chatId: id,
            userId,
            role: "user",
            content: content.trim(),
          });
        }

        // 2. Create pending assistant message
        const assistantMessageId = await createMessage({
          chatId: id,
          userId,
          role: "assistant",
          content: "",
        });
        setPendingMessageId(assistantMessageId);

        // 3. Update status to streaming
        await updateMessage({
          messageId: assistantMessageId,
          userId,
          status: "streaming",
        });

        // 4. Start API stream
        abortControllerRef.current = new AbortController();

        const response = await fetch(`/api/chat/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...messages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: content.trim() },
            ],
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        // 5. Stream chunks
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;
          setStreamingContent(accumulatedContent);

          // Real-time update to Convex
          await updateMessage({
            messageId: assistantMessageId,
            userId,
            content: accumulatedContent,
            append: false,
          });

          scrollToBottom();
        }

        // 6. Mark as complete
        await updateMessage({
          messageId: assistantMessageId,
          userId,
          content: accumulatedContent,
          status: "sent",
        });

        setStreamingContent("");
        setPendingMessageId(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);

        if (pendingMessageId) {
          await updateMessage({
            messageId: pendingMessageId,
            userId,
            status: "error",
            content: streamingContent || "Failed to generate response",
          });
        }

        console.error("Chat error:", err);
      } finally {
        setIsStreaming(false);
        textareaRef.current?.focus();
      }
    },
    [
      id,
      userId,
      messages,
      createMessage,
      updateMessage,
      scrollToBottom,
      pendingMessageId,
      streamingContent,
    ],
  );

  // Auto-trigger AI response if last message is from user (for redirect from new chat)
  useEffect(() => {
    if (
      autoTrigger &&
      !hasAutoTriggered.current &&
      messages.length > 0 &&
      !isStreaming
    ) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        hasAutoTriggered.current = true;
        // Skip creating user message since it already exists from initial redirect
        sendMessage(lastMessage.content, true);
      }
    }
  }, [autoTrigger, messages, isStreaming, sendMessage]);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (isStreaming || !inputValue.trim()) return;

      const message = inputValue;
      setInputValue("");
      // Normal submission - create user message
      sendMessage(message, false);
    },
    [inputValue, isStreaming, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!isStreaming && inputValue.trim()) {
          sendMessage(inputValue, false);
          setInputValue("");
        }
      }
    },
    [inputValue, isStreaming, sendMessage],
  );

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue, adjustTextareaHeight]);

  const renderMessages = () => {
    return messages.map((message, index) => (
      <div
        key={message._id || index}
        className={cn(
          "flex w-full animate-in fade-in slide-in-from-bottom-2",
          message.role === "user" ? "justify-end" : "justify-start",
        )}
      >
        <div
          className={cn(
            "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 prose prose-sm dark:prose-invert",
            "shadow-sm",
            message.role === "user"
              ? "bg-primary text-primary-foreground ml-4 rounded-br-sm"
              : "bg-muted mr-4 rounded-bl-sm",
            message.status === "error" &&
              "bg-destructive/10 border border-destructive/50",
          )}
        >
          <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
          {message.status === "streaming" && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !streamingContent && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">New Conversation</p>
              <p className="text-sm">Send a message to start chatting</p>
            </div>
          </div>
        )}

        {renderMessages()}

        {isStreaming && streamingContent && (
          <div className="flex w-full justify-start animate-in fade-in">
            <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl bg-muted px-4 py-3 mr-4 rounded-bl-sm shadow-sm prose prose-sm dark:prose-invert">
              <Markdown remarkPlugins={[remarkGfm]}>
                {streamingContent}
              </Markdown>
              <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive animate-in fade-in">
            <p className="font-semibold mb-1">Error</p>
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur-sm p-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isStreaming ? "AI is thinking..." : "Type a message..."
              }
              disabled={isStreaming}
              rows={1}
              className={cn(
                "min-h-13 max-h-50 resize-none",
                "rounded-xl border bg-background px-4 py-3.5 pr-12",
                "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-all duration-200",
              )}
            />
            <div className="absolute right-3 bottom-3 text-[10px] text-muted-foreground pointer-events-none tabular-nums">
              {inputValue.length > 0 && `${inputValue.length}`}
            </div>
          </div>

          {isStreaming ? (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleStop}
              className="h-13 w-13 shrink-0 rounded-xl"
            >
              <StopCircleIcon className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim()}
              className="h-13 w-13 shrink-0 rounded-xl bg-primary hover:bg-primary/90"
            >
              <SendIcon className="h-5 w-5" />
            </Button>
          )}
        </form>

        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Press{" "}
          <kbd className="rounded bg-muted px-1 py-0.5 font-mono">Enter</kbd> to
          send,{" "}
          <kbd className="rounded bg-muted px-1 py-0.5 font-mono">
            Shift + Enter
          </kbd>{" "}
          for new line
        </p>
      </div>
    </div>
  );
}
