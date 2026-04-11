import express from "express";
import { generateBlogAI } from "../controllers/aiController.js";

const aiRouter = express.Router();

// ✅ CORRECT ROUTE
aiRouter.post("/generate", generateBlogAI);

export default aiRouter;