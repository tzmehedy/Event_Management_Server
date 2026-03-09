"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotRoutes = void 0;
const express_1 = __importDefault(require("express"));
const chatbot_controllers_1 = require("./chatbot.controllers");
const checkAuth_1 = require("../../middleware/checkAuth");
const user_interface_1 = require("../user/user.interface");
const router = express_1.default.Router();
// Send message (start new conversation or continue existing)
router.post("/send", (0, checkAuth_1.checkAuth)(user_interface_1.IRole.ADMIN, user_interface_1.IRole.HOST, user_interface_1.IRole.USER), chatbot_controllers_1.chatbotControllers.sendMessage);
// Get specific conversation by thread ID
router.get("/threads/:threadId", (0, checkAuth_1.checkAuth)(user_interface_1.IRole.ADMIN, user_interface_1.IRole.HOST, user_interface_1.IRole.USER), chatbot_controllers_1.chatbotControllers.getConversation);
// List all conversations for current user
router.get("/", (0, checkAuth_1.checkAuth)(user_interface_1.IRole.ADMIN, user_interface_1.IRole.HOST, user_interface_1.IRole.USER), chatbot_controllers_1.chatbotControllers.listConversations);
// Delete a conversation
router.delete("/threads/:threadId", (0, checkAuth_1.checkAuth)(user_interface_1.IRole.ADMIN, user_interface_1.IRole.HOST, user_interface_1.IRole.USER), chatbot_controllers_1.chatbotControllers.deleteConversation);
exports.chatbotRoutes = router;
