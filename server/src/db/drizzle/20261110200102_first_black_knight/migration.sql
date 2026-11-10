CREATE TYPE "generation_status" AS ENUM('PENDING', 'FAILED', 'SUCCESS');--> statement-breakpoint
CREATE TYPE "transaction_status" AS ENUM('PURCHASE', 'GENERATIONS');--> statement-breakpoint
CREATE TABLE "generations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"uploadUrl" text,
	"generationStatus" "generation_status" DEFAULT 'PENDING'::"generation_status",
	"creditCost" integer,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"generationId" uuid NOT NULL,
	"amount" integer NOT NULL,
	"type" "transaction_status" DEFAULT 'GENERATIONS'::"transaction_status",
	"idempotencyKey" text NOT NULL UNIQUE,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"name" text,
	"profileImgUrl" text,
	"credits" integer DEFAULT 10,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "generations" ADD CONSTRAINT "generations_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_generationId_generations_id_fkey" FOREIGN KEY ("generationId") REFERENCES "generations"("id");