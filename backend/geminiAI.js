import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("🔥🔥🔥 XATOLIK: GOOGLE_API_KEY .env faylida o'rnatilmagan yoki yuklanmadi! 🔥🔥🔥");
  process.exit(1); 
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY }); 

export default ai.models;