import { db } from "../db/index";
import { generationsTable, transactionsTable, usersTable } from "../db/schema";
import { and, eq, gte, sql } from "drizzle-orm";

/* 
 signed amounts in your transaction ledger:
 - -1 means one credit deducted.
 - +1 means one credit refunded.
 - +10 means ten credits purchased.
*/
/*
  Operation	          Idempotency key
Credit deduction	generation:<id>:debit
Credit refund	    generation:<id>:refund
Credit purchase	    purchase:<payment_id>
*/

// Do the db transaction for one generation
export async function reserveCredits(userId:string,idempotencyKey:string){
    return await db.transaction(async (tx) => {
        // Check for an existing request
        const [existing] = await tx
        .select()
        .from(generationsTable)
        .where(
            and(
            eq(generationsTable.userId, userId),
            eq(generationsTable.idempotencyKey, idempotencyKey)
            )
        );

        if (existing) {
        return {
            isDuplicate: true,
            generation: existing,
        };
        }
        // deduct the credit form the user
        const [user] = await tx.update(usersTable)
            .set({
                credits: sql`${usersTable.credits} - 1`,
            })
            .where(
                and(
                eq(usersTable.id, userId),
                gte(usersTable.credits, 1)
                )
            )
            .returning();

        if (!user) {
            throw new Error("User not found or insufficient credits");
        }

        // Note the generation (Kept it pending will conform after generation)
        const [ generation ]= await tx.insert(generationsTable)
        .values({
            userId:userId,
            creditCost:1,
            idempotencyKey:idempotencyKey,
            generationStatus:"PENDING"
        })
        .returning();

        if(!generation){
            throw new Error("Failed to create the generation record")
        }
        
        // Record credit deduction
        await tx.insert(transactionsTable)
        .values({
            userId:userId,
            amount:-1,
            generationId:generation?.id,
            type:"GENERATIONS",
            idempotencyKey:`generation:${generation.id}:debit`,

        });
        
        return {
            isDuplicate: false,
            generation,
        };

    });

}