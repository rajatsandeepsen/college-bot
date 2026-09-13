CREATE TYPE "category" AS ENUM('tech', 'art');--> statement-breakpoint
CREATE TYPE "type" AS ENUM('competition', 'workshop', 'other');--> statement-breakpoint
CREATE TABLE "events" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "events_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255),
	"category" "category" DEFAULT 'tech'::"category" NOT NULL,
	"type" "type" DEFAULT 'other'::"type" NOT NULL,
	"club" text,
	"department" text,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY,
	"name" varchar(255),
	"email" varchar(255) UNIQUE
);
