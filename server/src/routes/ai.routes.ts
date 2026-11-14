import { Router } from "express";
import { createThumbnail } from "../controllers/ai.controllers";
const app = Router();

app.post("/create",createThumbnail);

export default app;