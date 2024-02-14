import prisma from "../config/db";
import type { Message } from "@shared/types";

/**
 * Create a new message in the database
 * @param chatID chatID where the message is sent
 * @param senderID userID of the sender
 * @param content content of the message (text)
 * @returns messageID
 */
export async function createMessage(
  chatID: number,
  senderID: number,
  content: string
): Promise<number> {
  const message = await prisma.message.create({
    data: {
      content,
      chatId: chatID,
      userId: senderID,
    },
  });

  return message.messageId;
}

/**
 * Get the last n messages from a chat
 * @param chatID
 * @param n default is 25
 * @returns array of Messages
 */
export async function getMessages(
  chatID: number,
  n: number = 25
): Promise<Message[]> {
  const messages = await prisma.message.findMany({
    where: {
      chatId: chatID,
    },
    take: n,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      messageId: true,
      content: true,
      createdAt: true,
      chatId: true,
      attachment: true,
      user: {
        select: {
          id: true,
          username: true,
          createdAt: true,
        },
      },
    },
  });

  return messages;
}

/**
 * Get a single message by its ID
 * @param messageId  ID of the message
 * @returns Message
 */
export async function getMessage(messageId: number): Promise<Message> {
  const message = await prisma.message.findUnique({
    where: {
      messageId,
    },
    select: {
      messageId: true,
      content: true,
      createdAt: true,
      chatId: true,
      attachment: true,
      user: {
        select: {
          id: true,
          username: true,
          createdAt: true,
        },
      },
    },
  });

  if (!message) {
    throw new Error("Message not found");
  }

  return message;
}
