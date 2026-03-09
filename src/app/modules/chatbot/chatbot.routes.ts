import express, { Router } from "express";
import { chatbotControllers } from "./chatbot.controllers";
import { checkAuth } from "../../middleware/checkAuth";
import { IRole } from "../user/user.interface";

const router: Router = express.Router();

// Send message (start new conversation or continue existing)
router.post("/send", checkAuth(IRole.ADMIN, IRole.HOST, IRole.USER), chatbotControllers.sendMessage);

// Get specific conversation by thread ID
router.get("/threads/:threadId", checkAuth(IRole.ADMIN, IRole.HOST, IRole.USER), chatbotControllers.getConversation);

// List all conversations for current user
router.get("/", checkAuth(IRole.ADMIN, IRole.HOST, IRole.USER), chatbotControllers.listConversations);

// Delete a conversation
router.delete("/threads/:threadId", checkAuth(IRole.ADMIN, IRole.HOST, IRole.USER), chatbotControllers.deleteConversation);

export const chatbotRoutes = router;
