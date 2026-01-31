import { SidebarProvider } from "@/components/ui/sidebar";
import ChatSidePanel from "./components/chat-sidepanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, SparklesIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="flex">
      <ChatSidePanel />
      <main className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition">
              <span>Pashucare</span>
              <ChevronDownIcon className="h-4 w-4 opacity-70" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={8}
            className="w-64 rounded-xl p-2"
          >
            {/* Current plan */}
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Current
            </DropdownMenuLabel>

            <DropdownMenuItem className="flex flex-col items-start gap-0.5 rounded-lg px-3 py-2">
              <span className="text-sm font-medium">pashucare v0.1</span>
              <span className="text-xs text-muted-foreground">
                Free research preview
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Upgrade */}
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Plans
            </DropdownMenuLabel>

            <DropdownMenuItem className="flex items-center gap-2 rounded-lg px-3 py-2">
              <SparklesIcon className="h-4 w-4 text-primary" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Upgrade</span>
                <span className="text-xs text-muted-foreground">
                  Unlock advanced features
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {children}
      </main>
    </SidebarProvider>
  );
}
