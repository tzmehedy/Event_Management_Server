"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatbotControllers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const chatbot_validation_1 = require("./chatbot.validation");
const chatbot_services_1 = require("./chatbot.services");
exports.chatbotControllers = {
    sendMessage: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = (req.user?.id || req.user?.userId);
        const validatedData = chatbot_validation_1.sendMessageValidation.parse(req.body);
        const result = await chatbot_services_1.chatbotServices.sendMessage(userId, validatedData.threadId, validatedData.message, validatedData.title);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Message sent successfully",
            data: result,
        });
    }),
    getConversation: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = (req.user?.id || req.user?.userId);
        const { threadId } = chatbot_validation_1.getConversationValidation.parse({
            threadId: req.params.threadId,
        });
        const result = await chatbot_services_1.chatbotServices.getConversation(userId, threadId);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Conversation retrieved",
            data: result,
        });
    }),
    listConversations: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = (req.user?.id || req.user?.userId);
        const { limit, skip } = chatbot_validation_1.listConversationsValidation.parse(req.query);
        const result = await chatbot_services_1.chatbotServices.listConversations(userId, limit, skip);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Conversations retrieved",
            data: result,
        });
    }),
    deleteConversation: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const userId = (req.user?.id || req.user?.userId);
        const { threadId } = chatbot_validation_1.getConversationValidation.parse({
            threadId: req.params.threadId,
        });
        const result = await chatbot_services_1.chatbotServices.deleteConversation(userId, threadId);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: "Conversation deleted successfully",
            data: result,
        });
    }),
};
