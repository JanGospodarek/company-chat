import { v5 as uuidv5 } from "uuid";
import {
  createGroupChat,
  createPrivateChat,
  getChat,
  userInChat,
  addUsersToChat as aUsersToChat,
} from "@models/chat";
import { getUserByUsername } from "@models/user";
import fs from "fs";

const CHAT_NAMESPACE = "03e5a08d-295e-4b1d-acab-6a5c657cbaee";

type NewChat = {
  name?: string;
  receipient?: string;
};

type AddUsers = {
  chatId: number;
  users: number[];
};

import type { User } from "@shared/types";
import { notifyMessage, notifyNewChat } from "./message";
import { addAttachment, createMessage, getMessage } from "@models/message";
import type formidable from "formidable";
import { saveMedia } from "@models/media";

export async function newChat(user: User, data: NewChat): Promise<number> {
  if (user === undefined) {
    throw new Error("Missing fields");
  }

  if (data.name === undefined && data.receipient === undefined) {
    throw new Error("Missing fields");
  }

  if (data.name) {
    const chatId = await createGroupChat(data.name, user.id);

    notifyNewChat(chatId, [user.id]);

    return chatId;
  } else {
    const receipient = await getUserByUsername(data.receipient!);

    if (!receipient) {
      throw new Error("User not found");
    }

    if (receipient.username === user.username) {
      throw new Error("You cannot create a chat with yourself");
    }

    const chatId = await createPrivateChat(user.id, receipient.id);

    notifyNewChat(chatId, [user.id, receipient.id]);

    return chatId;
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

  const chat = await getChat(data.chatId, user.id);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (chat.type === "PRIVATE") {
    throw new Error("Cannot add users to private chat");
  }

  await aUsersToChat(chat.chatId, data.users);

  notifyNewChat(chat.chatId, data.users);

  return chat.chatId;
}

export async function handleFileUpload(
  chatId: number,
  userId: number,
  content: string | undefined,
  files: formidable.File[]
) {
  if (!userInChat(chatId, userId)) {
    throw new Error("User not in chat");
  }

  const messageId = await createMessage(chatId, userId, content || "");

  // Upload files
  const uuid = uuidv5(messageId.toString(), CHAT_NAMESPACE);

  const filePath = `./uploads/${uuid}`;
  fs.mkdirSync(filePath, { recursive: true });

  const filesToSave: { path: string; type: string; name: string }[] = [];

  for (const file of files) {
    const newPath = `${filePath}/${file.originalFilename}`;
    fs.renameSync(file.filepath, newPath);

    filesToSave.push({
      path: newPath,
      type: file.mimetype || "application/octet-stream",
      name: file.originalFilename || "file",
    });
  }

  const storageURL = `/media/${uuid}`;

  await addAttachment(messageId, storageURL);
  await saveMedia(uuid, filesToSave);

  notifyMessage(messageId);
}
