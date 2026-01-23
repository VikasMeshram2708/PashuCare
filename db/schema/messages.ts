import { index, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { chats } from "./chat";
import { timeStamps } from "./ts";

export const Role = pgEnum("role", ["system", "user", "assistant"]);

export const messages = pgTable(
  "messages",
  {
    id: uuid().defaultRandom().primaryKey(),
    chatId: uuid()
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    role: Role().notNull(),
    text: text().notNull(),
    ...timeStamps,
  },
  (d) => [
    index("msgs_msg_id_idx").on(d.chatId),
    index("msgs_created_on_idx").on(d.chatId, d.createdAt),
  ],
);

export type SelectMessage = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
