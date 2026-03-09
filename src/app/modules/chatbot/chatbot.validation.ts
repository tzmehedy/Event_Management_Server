import { z } from "zod";

export const sendMessageValidation = z.object({
  threadId: z.string().optional(),
  message: z.string().min(1, "Message cannot be empty"),
  title: z.string().optional(),
});

export const getConversationValidation = z.object({
  threadId: z.string().min(1, "Thread ID is required"),
});

export const listConversationsValidation = z.object({
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
  skip: z.coerce.number().min(0).default(0).optional(),
});

export type SendMessageType = z.infer<typeof sendMessageValidation>;
export type GetConversationType = z.infer<typeof getConversationValidation>;
export type ListConversationsType = z.infer<typeof listConversationsValidation>;
