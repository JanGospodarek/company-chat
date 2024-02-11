import { getUserByUsername, type IUser } from "../models/user";
import {
  createChat as cChat,
  createGroupChat as cGroupChat,
  getChatByID,
  userInChat as uInChat,
  addUsersToChat as aUsersToChat,
  getUserChats,
} from "../models/chat";

import { type Chat } from "../../../shared/types";

export async function getChats(userID: number): Promise<Chat[]> {
  if (userID === undefined) {
    throw new Error("Missing fields");
  }

  const rawChats = await getUserChats(userID);
  const chats = rawChats.map((c) => {
    const messages = c.Message.map((m) => {
      return {
        messageId: m.messageId,
        content: m.content,
        attachment: m.attachment,
        createdAt: m.createdAt,
        sender: m.user,
      };
    });

    return {
      chatId: c.chatId,
      name: c.name,
      type: c.type,
      createdAt: c.createdAt,
      messages: messages,
    };
  });

  return chats;
}

export const createChat = async (
  user: IUser,
  group: boolean,
  name?: string,
  receipient?: string
) => {
  if (!user) {
    throw new Error("User not found");
  }

  if (group) {
    if (!name) {
      throw new Error("Missing fields");
    }

    // Create group chat
    const chat = await cGroupChat(name, user.id);

    return chat;
  } else {
    if (!receipient) {
      throw new Error("Missing fields");
    }

    const rec = await getUserByUsername(receipient);

    if (!rec) {
      throw new Error("User not found");
    }

    if (rec.username === user.username) {
      throw new Error("You cannot create a chat with yourself");
    }

    // Create chat
    const chat = await cChat(user.id, rec.id);

    return chat;
  }
};

export const addUsersToChat = async (
  chatID: number,
  users: string[],
  userID: number
) => {
  if (chatID === undefined || !users || userID === undefined) {
    throw new Error("Missing fields");
  }

  const chat = await getChatByID(chatID);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (!users.length) {
    throw new Error("No users to add");
  }

  if (chat.type === "PRIVATE") {
    throw new Error("Cannot add users to private chat");
  }

  // Check if user is in chat
  const userInChat = await uInChat(chatID, userID);

  if (!userInChat) {
    throw new Error("User not in chat");
  }

  // Get userIDs
  const userIDs = await Promise.all(
    users.map(async (username) => {
      const user = await getUserByUsername(username);

      if (!user) {
        throw new Error("User not found");
      }

      return user.id;
    })
  );

  // Add users to chat
  await aUsersToChat(chatID, userIDs);

  return chat;
};
