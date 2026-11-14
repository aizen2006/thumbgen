import OpenAI from "openai";
import 'dotenv/config';

// check on the key
if(!process.env.OPENAI_API_KEY) throw new Error("Please setup the openai key");

export const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY,
    maxRetries: 2,
    timeout: 30000
});