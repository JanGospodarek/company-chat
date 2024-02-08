import type { User } from "@prisma/client";
import { createMessage, getMessages } from "../models/message";
import { Socket } from "socket.io";
import { getChatByID, getChatUsers } from "../models/chat";

const socketMap = new Map<number, Socket>();

export const connectUser = async (socket: Socket) => {
  const user = socket.data["user"] as User;

  socketMap.set(user.id, socket);
};

export const disconnectUser = async (user: User) => {
  socketMap.delete(user.id);
};

export const sendMessage = async (data: any, socket: Socket) => {
  const { chatID, content }: { chatID: number; content: string } = data;

  if (chatID === undefined || content === undefined) {
    throw new Error("Invalid data");
  }

  const chat = await getChatByID(chatID);

  if (!chat) {
    throw new Error("Chat does not exist");
  }

  const user = socket.data["user"] as User;

  const message = await createMessage(chatID, user.id, content);

  const users = await getChatUsers(chatID);

  for (let user of users) {
    const s = socketMap.get(user);

    if (s) {
      s.emit("message", message);
    }
  }
};

export const getChatMessages = async (chatID: number) => {
  const messages = await getMessages(chatID);

  return messages;
};
