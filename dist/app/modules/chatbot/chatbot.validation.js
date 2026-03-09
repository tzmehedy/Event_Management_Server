"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listConversationsValidation = exports.getConversationValidation = exports.sendMessageValidation = void 0;
const zod_1 = require("zod");
exports.sendMessageValidation = zod_1.z.object({
    threadId: zod_1.z.string().optional(),
    message: zod_1.z.string().min(1, "Message cannot be empty"),
    title: zod_1.z.string().optional(),
});
exports.getConversationValidation = zod_1.z.object({
    threadId: zod_1.z.string().min(1, "Thread ID is required"),
});
exports.listConversationsValidation = zod_1.z.object({
    limit: zod_1.z.coerce.number().min(1).max(100).default(10).optional(),
    skip: zod_1.z.coerce.number().min(0).default(0).optional(),
});
