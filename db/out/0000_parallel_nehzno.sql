CREATE TYPE "public"."role" AS ENUM('SYSTEM', 'USER', 'ASSISTANT');--> statement-breakpoint
CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" text NOT NULL,
	"userId" text,
	"isPinned" boolean DEFAULT false,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone,
	CONSTRAINT "chats_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" uuid NOT NULL,
	"role" "role" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_chats_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chats_user_id_idx" ON "chats" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "chats_is_pinned_idx" ON "chats" USING btree ("isPinned");--> statement-breakpoint
CREATE INDEX "chats_created_at_idx" ON "chats" USING btree ("userId","created_at");--> statement-breakpoint
CREATE INDEX "msgs_msg_id_idx" ON "messages" USING btree ("chatId");--> statement-breakpoint
CREATE INDEX "msgs_created_on_idx" ON "messages" USING btree ("chatId","created_at");