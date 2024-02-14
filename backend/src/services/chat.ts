import {
  createGroupChat,
  createPrivateChat,
  getChat,
  userInChat,
  addUsersToChat as aUsersToChat,
} from "@models/chat";
import { getUserByUsername } from "@models/user";

type NewChat = {
  group: boolean;
  name?: string;
  receipient?: string;
};

type AddUsers = {
  chatId: number;
  users: number[];
};

import type { User } from "@shared/types";

export async function newChat(user: User, data: NewChat): Promise<number> {
  if (user === undefined) {
    throw new Error("Missing fields");
  }

  if ((data.group && !data.name) || (!data.group && !data.receipient)) {
    throw new Error("Missing fields");
  }

  if (data.group) {
    return await createGroupChat(data.name!, user.id);
  } else {
    const receipient = await getUserByUsername(data.receipient!);

    if (!receipient) {
      throw new Error("User not found");
    }

    if (receipient.username === user.username) {
      throw new Error("You cannot create a chat with yourself");
    }

    return await createPrivateChat(user.id, receipient.id);
  }
}

export async function addUsersToChat(
  user: User,
  data: AddUsers
): Promise<number> {
  if (user === undefined || data.chatId === undefined || !data.users.length) {
    throw new Error("Missing fields");
  }

  // Check if user is in chat
  if (!(await userInChat(data.chatId, user.id))) {
    throw new Error("User not in chat");
  }

  const chat = await getChat(data.chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (chat.type === "PRIVATE") {
    throw new Error("Cannot add users to private chat");
  }

  await aUsersToChat(chat.chatId, data.users);

  return chat.chatId;
}
