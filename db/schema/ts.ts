import { timestamp } from "drizzle-orm/pg-core";

export const timeStamps = {
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true }),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }),
};
