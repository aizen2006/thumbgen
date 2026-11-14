import type { Request, Response } from 'express';
import { generateImage , improvePrompt } from "../services/ai.services"
import { reserveCredits } from '../services/db.services';
export async function createThumbnail( req:Request, res:Response){
    const prompt = req.body;
    // const user = req.user;
    
    // input validation
    if(!prompt){
        return res.status(400).json({
            message:"Please send a valid input prompt"
        });
    }
    // Improve the prompt
    const improvedPrompt = await improvePrompt(prompt);

    // const result = await reserveCredits()
    
    
}