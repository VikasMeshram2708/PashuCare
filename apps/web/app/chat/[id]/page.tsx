import { notFound } from "next/navigation";
import ActiveChatInput from "../components/active-chat-input";

type ChatPageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ChatIdPage({ params }: ChatPageParams) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div className="flex h-[90dvh] flex-col bg-background">
      {/* Chat input pinned to bottom */}
      <div className="mt-auto">
        <ActiveChatInput id={id} />
      </div>
    </div>
  );
}
