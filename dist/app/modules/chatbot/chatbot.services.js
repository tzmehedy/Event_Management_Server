"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotServices = void 0;
const openai_1 = __importDefault(require("openai"));
const uuid_1 = require("uuid");
const chatbot_model_1 = require("./chatbot.model");
// import { AppError } from "../../../errorHelpers/appError";
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const appError_1 = __importDefault(require("../../errorHelpers/appError"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const SYSTEM_PROMPT = `You are a friendly and helpful customer support chatbot for an event management platform. 
You help users with:
- Event browsing and search
- Booking assistance
- Payment inquiries
- Account support
- General questions about the platform

Be concise, professional, and helpful. If you don't know something, direct the user to contact support.`;
exports.chatbotServices = {
    async sendMessage(userId, threadId, message, title) {
        try {
            let conversation;
            let finalThreadId = threadId;
            // Create or retrieve conversation
            if (!finalThreadId) {
                finalThreadId = (0, uuid_1.v4)();
                conversation = new chatbot_model_1.Conversation({
                    userId,
                    threadId: finalThreadId,
                    title: title || message.substring(0, 50),
                    messages: [],
                });
            }
            else {
                conversation = await chatbot_model_1.Conversation.findOne({
                    threadId: finalThreadId,
                    userId,
                });
                if (!conversation) {
                    throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Conversation thread not found");
                }
            }
            // Add user message
            conversation.messages.push({
                role: "user",
                content: message,
                timestamp: new Date(),
            });
            // Prepare messages for OpenAI
            const openaiMessages = conversation.messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
            }));
            // Call OpenAI API
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT,
                    },
                    ...openaiMessages,
                ],
                temperature: 0.7,
                max_tokens: 500,
            });
            const assistantMessage = response.choices[0].message.content;
            if (!assistantMessage) {
                throw new appError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to get response from AI");
            }
            // Add assistant message
            conversation.messages.push({
                role: "assistant",
                content: assistantMessage,
                timestamp: new Date(),
            });
            // Save conversation
            await conversation.save();
            return {
                messageId: (0, uuid_1.v4)(),
                threadId: finalThreadId,
                reply: assistantMessage,
                timestamp: new Date(),
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (error) {
            if (error instanceof appError_1.default) {
                throw error;
            }
            if (error.error?.message?.includes("401")) {
                throw new appError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "OpenAI API key is invalid or missing");
            }
            throw new appError_1.default(http_status_codes_1.default.INTERNAL_SERVER_ERROR, "Failed to process message: " + error.message);
        }
    },
    async getConversation(userId, threadId) {
        const conversation = await chatbot_model_1.Conversation.findOne({
            threadId,
            userId,
        });
        if (!conversation) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Conversation not found");
        }
        return conversation;
    },
    async listConversations(userId, limit = 10, skip = 0) {
        const conversations = await chatbot_model_1.Conversation.find({ userId })
            .sort({ updatedAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();
        const total = await chatbot_model_1.Conversation.countDocuments({ userId });
        return {
            data: conversations,
            total,
            limit,
            skip,
        };
    },
    async deleteConversation(userId, threadId) {
        const result = await chatbot_model_1.Conversation.deleteOne({
            threadId,
            userId,
        });
        if (result.deletedCount === 0) {
            throw new appError_1.default(http_status_codes_1.default.NOT_FOUND, "Conversation not found");
        }
        return { success: true, message: "Conversation deleted" };
    },
};
