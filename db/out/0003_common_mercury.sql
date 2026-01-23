ALTER TABLE "messages" ADD COLUMN "text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "content";