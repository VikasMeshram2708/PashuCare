import { SidebarProvider } from "@/components/ui/sidebar";
import ChatSidePanel from "./components/chat-sidepanel";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="flex">
      <ChatSidePanel />
      {children}
    </SidebarProvider>
  );
}
