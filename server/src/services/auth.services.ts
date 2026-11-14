import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import 'dotenv/config';

const saltRounds = process.env.SALT_ROUNDS ?? 10;

interface SignUpInput{
    name:string;
    email:string;
    password:string;
    profileImgUrl?:string
}

export async function signupUser({name,email,password,profileImgUrl}:SignUpInput){
    // Normalise the email
    const normalisedEmail = email.trim().toLowerCase();

    // check if user exists with this email
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email,normalisedEmail)).limit(1);
    if(existingUser.length>0){
        throw new Error("Email already exists");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password,saltRounds);

    // create user
    const [newUser] = await db.insert(usersTable).values({
        email:normalisedEmail,
        password_hash:hashedPassword,
        name:name,
        profileImgUrl:profileImgUrl
    }).returning();

    // generate jwt
    const secret = process.env.JWT_SECRET;

    if(!secret){
        throw new Error("Please add the JWT_SECRET in the env");
    }
    const token = jwt.sign(
        {userId:newUser?.id},
        secret,
        { expiresIn:"7d" }
    );

    return {
        user:newUser,
        token:token
    };
}