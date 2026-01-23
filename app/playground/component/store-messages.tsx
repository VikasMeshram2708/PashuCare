import { SidebarMenuButton } from "@/components/ui/sidebar";
import { db } from "@/db";
import { chats } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StoreMessages() {
  const user = await currentUser();
  if (!user) {
    notFound();
  }
  const items = await db.select().from(chats).where(eq(chats.userId, user?.id));

  return (
    <div>
      {items?.map((item) => (
        <SidebarMenuButton key={item.id} asChild>
          <Link href={`/playground/chat/${item.id}`}>
            <span className="text-sm">{item.title}</span>
          </Link>
        </SidebarMenuButton>
      ))}
    </div>
  );
}
