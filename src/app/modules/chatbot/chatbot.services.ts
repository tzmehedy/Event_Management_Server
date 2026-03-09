import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { Conversation } from "./chatbot.model";
// import { AppError } from "../../../errorHelpers/appError";
import  httpStatusCode  from "http-status-codes";
import { IConversation } from "./chatbot.interfaces";
import AppError from "../../errorHelpers/appError";

const openai = new OpenAI({
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

export const chatbotServices = {
  async sendMessage(userId: string, threadId: string | undefined, message: string, title?: string) {
    try {
      let conversation: IConversation | null;
      let finalThreadId = threadId;

      // Create or retrieve conversation
      if (!finalThreadId) {
        finalThreadId = uuidv4();
        conversation = new Conversation({
          userId,
          threadId: finalThreadId,
          title: title || message.substring(0, 50),
          messages: [],
        });
      } else {
        conversation = await Conversation.findOne({
          threadId: finalThreadId,
          userId,
        });

        if (!conversation) {
          throw new AppError(
            httpStatusCode.NOT_FOUND,
            "Conversation thread not found"
          );
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
        role: msg.role as "user" | "assistant",
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
        throw new AppError(
          httpStatusCode.INTERNAL_SERVER_ERROR,
          "Failed to get response from AI"
        );
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
        messageId: uuidv4(),
        threadId: finalThreadId,
        reply: assistantMessage,
        timestamp: new Date(),
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error.error?.message?.includes("401")) {
        throw new AppError(
          httpStatusCode.INTERNAL_SERVER_ERROR,
          "OpenAI API key is invalid or missing"
        );
      }

      throw new AppError(
        httpStatusCode.INTERNAL_SERVER_ERROR,
        "Failed to process message: " + error.message
      );
    }
  },

  async getConversation(userId: string, threadId: string) {
    const conversation = await Conversation.findOne({
      threadId,
      userId,
    });

    if (!conversation) {
      throw new AppError(
        httpStatusCode.NOT_FOUND,
        "Conversation not found"
      );
    }

    return conversation;
  },

  async listConversations(userId: string, limit = 10, skip = 0) {
    const conversations = await Conversation.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Conversation.countDocuments({ userId });

    return {
      data: conversations,
      total,
      limit,
      skip,
    };
  },

  async deleteConversation(userId: string, threadId: string) {
    const result = await Conversation.deleteOne({
      threadId,
      userId,
    });

    if (result.deletedCount === 0) {
      throw new AppError(
        httpStatusCode.NOT_FOUND,
        "Conversation not found"
      );
    }

    return { success: true, message: "Conversation deleted" };
  },
};
