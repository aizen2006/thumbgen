import { integer, pgTable, timestamp,text, uuid ,pgEnum ,uniqueIndex} from "drizzle-orm/pg-core";

export const generationsEnum = pgEnum('generation_status',["PENDING","FAILED","SUCCESS"]);
export const transactionsEnum = pgEnum(
  "transaction_type",
  ["PURCHASE", "GENERATIONS", "REFUND"]
);


export const usersTable = pgTable("users", {
  id:uuid().primaryKey().defaultRandom(),
  email:text().notNull().unique(),
  password_hash:text().notNull(),
  name:text(),
  profileImgUrl:text(),
  credits:integer().notNull().default(10), // user gets free 10 credits 
  createdAt:timestamp().defaultNow(),
  updatedAt:timestamp()
});

export const generationsTable = pgTable("generations",{
    id:uuid().primaryKey().defaultRandom(),
    userId:uuid().notNull().references(()=>usersTable.id),
    uploadUrl:text(),
    generationStatus:generationsEnum().default("PENDING"),
    creditCost:integer(),
    idempotencyKey:text().unique().notNull(),
    createdAt:timestamp().defaultNow(),
    updatedAt:timestamp()
},(table) => [
  // here we have used composite unique index
  uniqueIndex("generation_user_idempotency_idx")
    .on(table.userId, table.idempotencyKey),
]);

export const transactionsTable = pgTable("transactions",{
    id:uuid().primaryKey().defaultRandom(),
    userId:uuid().notNull().references(()=>usersTable.id),
    generationId:uuid().references(()=>generationsTable.id),
    amount:integer().notNull(),
    type:transactionsEnum().default("GENERATIONS"),
    idempotencyKey:text().unique().notNull(),
    createdAt:timestamp().defaultNow()
})
