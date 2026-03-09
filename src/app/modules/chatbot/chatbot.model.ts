import mongoose, { Schema } from "mongoose";
import { IConversation, IMessage } from "./chatbot.interfaces";

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const conversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    threadId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Conversation",
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export const Conversation = mongoose.model<IConversation>(
  "Conversation",
  conversationSchema
);
