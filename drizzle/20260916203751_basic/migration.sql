CREATE TYPE "category" AS ENUM('other', 'tech', 'art', 'sports', 'academic', 'social');--> statement-breakpoint
CREATE TYPE "type" AS ENUM('other', 'competition', 'workshop', 'seminar', 'hackathon', 'fest');--> statement-breakpoint
CREATE TABLE "events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"category" "category" DEFAULT 'other'::"category" NOT NULL,
	"type" "type" DEFAULT 'other'::"type" NOT NULL,
	"club" text DEFAULT 'unknown' NOT NULL,
	"department" text DEFAULT 'unknown' NOT NULL,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_after" interval
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"name" varchar(255),
	"email" varchar(255) UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"subscriptions" text[] DEFAULT '{}'::text[]
);
--> statement-breakpoint
CREATE INDEX "users_name_idx" ON "users" ("name");--> statement-breakpoint
CREATE INDEX "users_subscriptions_idx" ON "users" USING gin ("subscriptions");