import { createMessage, getMessages } from "../models/message";
import { Socket } from "socket.io";
import { getChatByID, getChatUsers } from "../models/chat";
import type { User } from "../../../shared/types";

const socketMap = new Map<number, Socket>();

export const connectUser = async (socket: Socket) => {
  const user = socket.data["user"] as User;

  socketMap.set(user.id, socket);
};

export const disconnectUser = async (user: User) => {
  socketMap.delete(user.id);
};

export const receiveMessage = async (data: any, socket: Socket) => {
  const { chatID, content }: { chatID: number; content: string } = data;

  // Validate chatID
  if (typeof chatID !== "number") {
    throw new Error("Invalid chatID");
  }

  // Validate content
  if (typeof content !== "string" || content.length === 0) {
    throw new Error("Invalid content");
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

export const notifyActivity = async () => {
  const activeUsers: User[] = [];

  for (let [_, socket] of socketMap) {
    const _user = socket.data["user"];
    const user: User = {
      id: _user.id,
      username: _user.username,
      createdAt: _user.createdAt,
    };

    activeUsers.push(user);
  }

  for (let [_, socket] of socketMap) {
    socket.emit(
      "activity",
      activeUsers.filter((u) => u.id !== socket.data["user"].id)
    );
  }
};
