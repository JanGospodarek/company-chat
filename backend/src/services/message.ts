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
import { encryptSocketData } from "./crypto";

type Message = {
  chatID: number;
  content: string;
};

const socketMap = new Map<number, Socket>();

export const connectUser = async (socket: Socket) => {
  const user = socket.data["user"] as User;

  socketMap.set(user.id, socket);

  if (!socket.data["key"]) {
    const interval = setInterval(() => {
      if (socket.data["key"]) {
        clearInterval(interval);
        notifyActivity();
      }
    }, 10);

    setTimeout(() => {
      clearInterval(interval);
    }, 5000); // 5s
  } else {
    notifyActivity();
  }
};

export const disconnectUser = async (user: User) => {
  socketMap.delete(user.id);

  notifyActivity();
};

export async function receiveMessage(data: Message, socket: Socket) {
  if (typeof data.chatID !== "number") {
    throw new Error("Błędny chatID");
  }
  if (typeof data.content !== "string" || data.content.length === 0) {
    throw new Error("Błędna zawartość wiadomości");
  }

  const user = socket.data["user"] as User;
  const chat = await getChat(data.chatID, user.id);

  if (!chat) {
    throw new Error("Chat nie istnieje");
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
      const encrypted = encryptSocketData(message, s.data["key"]);
      s.emit("message", encrypted);
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
    if (!socket.data["key"]) {
      continue;
    }

    const encrypted = encryptSocketData(
      activeUsers.filter((u) => u.id !== socket.data["user"].id),
      socket.data["key"]
    );

    socket.emit("activity", encrypted);
  }
}

export async function notifyNewChat(chatID: number, users: number[]) {
  for (let user of users) {
    const s = socketMap.get(user);
    if (s) {
      const encrypted = encryptSocketData(chatID, s.data["key"]);
      s.emit("newChat", encrypted);
    }
  }
}

export async function readMessage(data: { messageId: number }, socket: Socket) {
  if (typeof data.messageId !== "number") {
    throw new Error("Błędny messageId");
  }

  const user = socket.data["user"] as User;
  const message = await getMessage(data.messageId);

  if (!message) {
    throw new Error("Wiadomość nie istnieje");
  }

  if (message.readBy.some((u) => u.id === user.id)) {
    return;
  }

  await rMessage(data.messageId, user.id);

  const newMessage = await getMessage(data.messageId);

  const chat = await getChat(message.chatId, user.id);

  if (!chat) {
    throw new Error("Czat nie istnieje");
  }

  const users =
    chat.type === "PRIVATE"
      ? [(chat as PrivateChat).receipient, user]
      : (chat as GroupChat).users;

  for (let user of users) {
    const s = socketMap.get(user.id);
    if (s) {
      const encrypted = encryptSocketData(newMessage, s.data["key"]);
      s.emit("read", encrypted);
    }
  }
}

export async function notifyMessage(messageId: number) {
  const message = await getMessage(messageId);

  if (!message) {
    throw new Error("Wiadomość nie istnieje");
  }

  const chat = await getChat(message.chatId, message.user.id);

  if (!chat) {
    throw new Error("Czat nie istnieje");
  }

  const users =
    chat.type === "PRIVATE"
      ? [(chat as PrivateChat).receipient, message.user]
      : (chat as GroupChat).users;

  for (let user of users) {
    const s = socketMap.get(user.id);
    if (s) {
      const encrypted = encryptSocketData(message, s.data["key"]);
      s.emit("message", encrypted);
    }
  }
}
