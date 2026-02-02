"use client";

import { cn } from "@/lib/utils";
import { Id } from "@/convex/_generated/dataModel";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";
import { Loader2Icon } from "lucide-react";

export interface Message {
  _id?: Id<"messages">;
  role: "user" | "assistant" | "system";
  content: string;
  status?: "pending" | "streaming" | "sent" | "error";
  createdAt?: number;
}

interface MessageListProps {
  messages: Message[];
  isLoadingMore: boolean;
  loadMore: () => void;
  streamingContent?: string;
  isStreaming?: boolean;
  error?: string | null;
  onDismissError?: () => void;
}

// Aggressive spacing fixes for headings
export const assistantProseClasses = cn(
  "prose prose-slate dark:prose-invert max-w-none w-full",
  // Heading spacing - force margin top and bottom
  "[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:font-semibold [&_h1]:text-lg",
  "[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:font-semibold [&_h2]:text-base",
  "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-base",
  "[&_strong]:font-semibold",
  // Paragraph spacing
  "[&_p]:my-3 [&_p]:leading-7",
  // Lists
  "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li]:my-1.5",
  "[&_li>p]:my-0", // Remove p margin inside li
  // Horizontal rules
  "[&_hr]:my-6 [&_hr]:border-t [&_hr]:border-border/50",
  // Blockquotes
  "[&_blockquote]:border-l-2 [&_blockquote]:border-muted-foreground/30 [&_blockquote]:pl-4 [&_blockquote]:py-1 [&_blockquote]:my-4 [&_blockquote]:not-italic [&_blockquote]:text-muted-foreground",
);
export default function MessageList({
  messages,
  isLoadingMore,
  loadMore,
  streamingContent,
  isStreaming,
  error,
  onDismissError,
}: MessageListProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  const prevScrollHeight = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          if (scrollContainerRef.current) {
            prevScrollHeight.current = scrollContainerRef.current.scrollHeight;
          }
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "20px" },
    );

    if (topRef.current) observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [loadMore, isLoadingMore]);

  useEffect(() => {
    if (isLoadingMore) return;
    const container = scrollContainerRef.current;
    if (container && prevScrollHeight.current > 0) {
      const diff = container.scrollHeight - prevScrollHeight.current;
      if (diff > 0) container.scrollTop = diff;
      prevScrollHeight.current = 0;
    }
  }, [messages, isLoadingMore]);

  useEffect(() => {
    if (isFirstLoad.current && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      isFirstLoad.current = false;
      return;
    }
    if (isStreaming || streamingContent) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming, streamingContent]);

  const displayMessages = [...messages]
    .filter((m) => m.status !== "streaming")
    .reverse();

  const userProseClasses = cn(
    "prose prose-sm prose-invert max-w-none",
    "[&_p]:my-0 [&_p]:leading-relaxed",
    "[&_ul]:my-1 [&_li]:my-0",
  );

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto scroll-smooth"
    >
      <div ref={topRef} className="h-1 opacity-0" />

      {isLoadingMore && (
        <div className="flex justify-center py-4">
          <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {displayMessages.length === 0 && !streamingContent && (
        <div className="flex h-full items-center justify-center text-muted-foreground px-4">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">PashuCare AI</p>
            <p className="text-sm">How can I help your animal today?</p>
          </div>
        </div>
      )}

      {displayMessages.map((message, index) => (
        <div
          key={message._id || index}
          className={cn(
            "flex w-full",
            message.role === "user"
              ? "bg-muted/30 dark:bg-muted/10"
              : "bg-background",
          )}
        >
          <div
            className={cn(
              "flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-5",
              message.role === "user"
                ? "flex justify-end"
                : "flex justify-start",
            )}
          >
            {message.role === "user" ? (
              // User message - bubble style
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-5 py-3 max-w-[85%] shadow-sm">
                <div className={userProseClasses}>
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </Markdown>
                </div>
              </div>
            ) : (
              // Assistant message - NO background, NO border, NO shadow
              <div className="w-full py-1">
                <div className={assistantProseClasses}>
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </Markdown>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Streaming message */}
      {isStreaming && streamingContent && (
        <div className="flex w-full bg-background">
          <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-5">
            <div className="w-full py-1">
              <div className={assistantProseClasses}>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {streamingContent}
                </Markdown>
                <span className="inline-block w-2 h-4 ml-1 bg-primary/50 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {error && onDismissError && (
        <div className="flex w-full bg-background">
          <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-2">
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              <p className="font-semibold mb-1">Error</p>
              <p>{error}</p>
              <button
                className="mt-2 text-xs font-medium hover:underline"
                onClick={onDismissError}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-8" />
    </div>
  );
}
