// import { createMessage, getMessages, getMessage } from "../models/message";
import { Socket } from "socket.io";
// import { getChatByID, getChatNotify, getChatUsers } from "../models/chat";
import type { GroupChat, PrivateChat, User } from "@shared/types";
import { getChat } from "@models/chat";
import { createMessage, getMessage } from "@models/message";

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
