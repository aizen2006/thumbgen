import { integer, pgTable, timestamp,text, uuid ,pgEnum } from "drizzle-orm/pg-core";

export const generationsEnum = pgEnum('generation_status',["PENDING","FAILED","SUCCESS"]);
export const transactionsEnum = pgEnum('transaction_status',["PURCHASE","GENERATIONS"]);


export const usersTable = pgTable("users", {
  id:uuid().primaryKey().defaultRandom(),
  email:text().notNull().unique(),
  password_hash:text().notNull(),
  name:text(),
  profileImgUrl:text(),
  credits:integer().default(10), // user gets free 10 credits 
  createdAt:timestamp().defaultNow(),
  updatedAt:timestamp()
});

export const generationsTable = pgTable("generations",{
    id:uuid().primaryKey().defaultRandom(),
    userId:uuid().notNull().references(()=>usersTable.id),
    uploadUrl:text(),
    generationStatus:generationsEnum().default("PENDING"),
    creditCost:integer(),
    createdAt:timestamp().defaultNow(),
    updatedAt:timestamp()
});

export const transactionsTable = pgTable("transactions",{
    id:uuid().primaryKey().defaultRandom(),
    userId:uuid().notNull().references(()=>usersTable.id),
    generationId:uuid().notNull().references(()=>generationsTable.id),
    amount:integer().notNull(),
    type:transactionsEnum().default("GENERATIONS"),
    idempotencyKey:text().unique().notNull(),
    createdAt:timestamp().defaultNow()
})
