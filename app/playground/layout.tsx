import { SidebarProvider } from "@/components/ui/sidebar";
import PlaySidebar from "./component/play-sidebar";

export default function PlayGroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        {/* Sidebar */}
        <PlaySidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </SidebarProvider>
  );
}
