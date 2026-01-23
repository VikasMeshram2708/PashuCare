import ChatInput from "./components/chat-input";

export default function ChatPage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <h1 className="text-lg md:text-2xl font-bold text-center py-4">
        {"What's"} in your mind today?
      </h1>

      {/* Scrollable chat area */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* messages go here */}
      </div>

      {/* Sticky input */}
      <div className="w-5xl mx-auto">
        <ChatInput />
      </div>
    </div>
  );
}
