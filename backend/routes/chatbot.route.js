import express from 'express';

const router = express.Router();
import { handleChatbotRequest } from '../controllers/chatbot.controller.js';

router.post('/chatbot-recommend', handleChatbotRequest);

export default router;