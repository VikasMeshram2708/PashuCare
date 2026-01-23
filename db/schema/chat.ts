import {
  boolean,
  index,
  pgTable,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { timeStamps } from "./ts";

export const chats = pgTable(
  "chats",
  {
    id: uuid().defaultRandom().primaryKey(),
    title: varchar({ length: 255 }),
    slug: text().unique(),
    userId: text(),

    isPinned: boolean().default(false),
    ...timeStamps,
  },
  (d) => [
    index("chats_user_id_idx").on(d.userId),
    index("chats_is_pinned_idx").on(d.isPinned),
    index("chats_created_at_idx").on(d.userId, d.createdAt),
  ],
);

export type SelectChats = typeof chats.$inferSelect;
export type InsertChats = typeof chats.$inferInsert;
