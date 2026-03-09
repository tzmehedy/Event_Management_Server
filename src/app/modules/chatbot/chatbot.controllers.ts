import httpStatusCode  from 'http-status-codes';
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  sendMessageValidation,
  getConversationValidation,
  listConversationsValidation,
} from "./chatbot.validation";
import { chatbotServices } from "./chatbot.services";

export const chatbotControllers = {
  sendMessage: catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user?.id || req.user?.userId) as string;
    const validatedData = sendMessageValidation.parse(req.body);

    const result = await chatbotServices.sendMessage(
      userId,
      validatedData.threadId,
      validatedData.message,
      validatedData.title
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: "Message sent successfully",
      data: result,
    });
  }),

  getConversation: catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user?.id || req.user?.userId) as string;
    const { threadId } = getConversationValidation.parse({
      threadId: req.params.threadId,
    });

    const result = await chatbotServices.getConversation(userId, threadId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: "Conversation retrieved",
      data: result,
    });
  }),

  listConversations: catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user?.id || req.user?.userId) as string;
    const { limit, skip } = listConversationsValidation.parse(req.query);

    const result = await chatbotServices.listConversations(
      userId,
      limit,
      skip
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: "Conversations retrieved",
      data: result,
    });
  }),

  deleteConversation: catchAsync(async (req: Request, res: Response) => {
    const userId = (req.user?.id || req.user?.userId) as string;
    const { threadId } = getConversationValidation.parse({
      threadId: req.params.threadId,
    });

    const result = await chatbotServices.deleteConversation(userId, threadId);

    sendResponse(res, {
      success: true,
      statusCode: httpStatusCode.OK,
      message: "Conversation deleted successfully",
      data: result,
    });
  }),
};
