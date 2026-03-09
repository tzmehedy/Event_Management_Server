export interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IConversation {
  save(): unknown;
  _id?: string;
  userId: string;
  threadId: string;
  title: string;
  messages: IMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChatRequest {
  threadId?: string;
  message: string;
  title?: string;
}

export interface IChatResponse {
  messageId: string;
  threadId: string;
  reply: string;
  timestamp: Date;
}
