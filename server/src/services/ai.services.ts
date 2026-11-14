import { openai } from "../config/openai";
import { Buffer } from "node:buffer"
// improves the users prompt
export async function improvePrompt(prompt:string): Promise<string>{
    const impPrompt = await openai.responses.create({
        model:"gpt-6-luna",
        input:prompt,
        instructions:"You are a expert in prompt optimization , Your role is to analyze the prompt and polish it to get the best possible result for thumbnail generation"
    });

    return impPrompt.output_text
};

// generate the image
export async function generateImage(imgPrompt:string):Promise<Buffer<ArrayBuffer>>{
    const image = await openai.images.generate({
        model:"gpt-image-2.6-flare",
        prompt:imgPrompt,
        output_format:"webp",
        quality:"high"
    });

    const imageBase64 = image.data?.[0]?.b64_json;

    if (!imageBase64) {
    throw new Error("Image generation failed");
    }

    const imageBuffer = Buffer.from(imageBase64, "base64");

    return imageBuffer
};

