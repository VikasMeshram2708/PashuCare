import { Suspense } from "react";

import ChatMessages from "../components/chat-messages";

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: chatId } = await params;

  return (
    <div className="max-w-5xl mx-auto">
      Chat Detail Page id: {decodeURIComponent(chatId)}
      {/* messages */}
      <Suspense
        fallback={
          <p className="text-sm text-neutral-400">loading messages...</p>
        }
      >
        <ChatMessages chatId={chatId} />
      </Suspense>
    </div>
  );
}
