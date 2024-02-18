// import { createMessage, getMessages, getMessage } from "../models/message";
import { Socket } from "socket.io";
// import { getChatByID, getChatNotify, getChatUsers } from "../models/chat";
import type { GroupChat, PrivateChat, User } from "@shared/types";
import { getChat } from "@models/chat";
import {
  createMessage,
  getMessage,
  readMessage as rMessage,
} from "@models/message";

type Message = {
  chatID: number;
  content: string;
};

const socketMap = new Map<number, Socket>();

export const connectUser = async (socket: Socket) => {
  const user = socket.data["user"] as User;

  socketMap.set(user.id, socket);

  notifyActivity();
};

export const disconnectUser = async (user: User) => {
  socketMap.delete(user.id);

  notifyActivity();
};

export async function receiveMessage(data: Message, socket: Socket) {
  if (typeof data.chatID !== "number") {
    throw new Error("Invalid chatID");
  }
  if (typeof data.content !== "string" || data.content.length === 0) {
    throw new Error("Invalid content");
  }

  const user = socket.data["user"] as User;
  const chat = await getChat(data.chatID, user.id);

  if (!chat) {
    throw new Error("Chat does not exist");
  }

  const messageId = await createMessage(data.chatID, user.id, data.content);
  const message = await getMessage(messageId);

  const users =
    chat.type === "PRIVATE"
      ? [(chat as PrivateChat).receipient, user]
      : (chat as GroupChat).users;

  for (let user of users) {
    const s = socketMap.get(user.id);
    if (s) {
      s.emit("message", message);
    }
  }
}

async function notifyActivity() {
  const activeUsers: User[] = [];

  for (let [_, socket] of socketMap) {
    const user = socket.data["user"] as User;
    activeUsers.push(user);
  }

  for (let [_, socket] of socketMap) {
    socket.emit(
      "activity",
      activeUsers.filter((u) => u.id !== socket.data["user"].id)
    );
  }
}

export async function notifyNewChat(chatID: number, users: number[]) {
  for (let user of users) {
    const s = socketMap.get(user);
    if (s) {
      s.emit("newChat", chatID);
    }
  }
}

export async function readMessage(data: { messageId: number }, socket: Socket) {
  if (typeof data.messageId !== "number") {
    throw new Error("Invalid messageID");
  }

  const user = socket.data["user"] as User;
  const message = await getMessage(data.messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.readBy.some((u) => u.id === user.id)) {
    return;
  }

  await rMessage(data.messageId, user.id);

  const newMessage = await getMessage(data.messageId);

  const chat = await getChat(message.chatId, user.id);

  if (!chat) {
    throw new Error("Chat not found");
  }

  const users =
    chat.type === "PRIVATE"
      ? [(chat as PrivateChat).receipient, user]
      : (chat as GroupChat).users;

  for (let user of users) {
    const s = socketMap.get(user.id);
    if (s) {
      s.emit("read", newMessage);
    }
  }
}
