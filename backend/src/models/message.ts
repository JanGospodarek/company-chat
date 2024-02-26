import type { Prisma } from "@prisma/client";
import prisma from "../config/db";
import type { Message } from "@shared/types";

type RawMessage = Prisma.MessageGetPayload<{
  select: {
    messageId: true;
    content: true;
    createdAt: true;
    chatId: true;
    attachment: true;
    user: {
      select: {
        id: true;
        username: true;
        name: true;
        surname: true;
      };
    };
    ReadMessage: {
      select: {
        User: {
          select: {
            id: true;
            username: true;
            name: true;
            surname: true;
          };
        };
      };
    };
  };
}>;

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

  // Add the sender to the list of users who read the message
  await prisma.readMessage.create({
    data: {
      messageId: message.messageId,
      userId: senderID,
    },
  });

  return message.messageId;
}

/**
 * Get the last n messages from a chat
 * @param chatID
 * @param n default is 50
 * @returns array of Messages
 */
export async function getMessages(
  chatID: number,
  n: number = 50,
  lastId?: number
): Promise<Message[]> {
  let laterThan: Prisma.MessageWhereUniqueInput | undefined;

  if (lastId) {
    const lastMessage = await prisma.message.findUnique({
      where: {
        messageId: lastId,
      },
    });

    if (!lastMessage) {
      throw new Error("Wiadomość nie istnieje");
    }

    laterThan = {
      messageId: lastId,
    };
  }

  const rawMessages = await prisma.message.findMany({
    where: {
      chatId: chatID,
      messageId: laterThan ? { lt: laterThan.messageId } : undefined,
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
          name: true,
          surname: true,
        },
      },
      ReadMessage: {
        select: {
          User: {
            select: {
              id: true,
              username: true,
              name: true,
              surname: true,
            },
          },
        },
      },
    },
  });

  const messages = rawMessages.map((message) => parseMessage(message));

  return messages;
}

/**
 * Get a single message by its ID
 * @param messageId  ID of the message
 * @returns Message
 */
export async function getMessage(messageId: number): Promise<Message> {
  const message: RawMessage | null = await prisma.message.findUnique({
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
          name: true,
          surname: true,
        },
      },
      ReadMessage: {
        select: {
          User: {
            select: {
              id: true,
              username: true,
              name: true,
              surname: true,
            },
          },
        },
      },
    },
  });

  if (!message) {
    throw new Error("Wiadomość nie istnieje");
  }

  return parseMessage(message);
}

export async function readMessage(messageId: number, userId: number) {
  const message = await getMessage(messageId);

  await prisma.readMessage.create({
    data: {
      messageId,
      userId,
    },
  });

  return message;
}

export async function addAttachment(
  messageId: number,
  url: string
): Promise<void> {
  await prisma.message.update({
    where: {
      messageId,
    },
    data: {
      attachment: url,
    },
  });
}

export const parseMessage = (message: RawMessage): Message => {
  return {
    messageId: message.messageId,
    content: message.content,
    createdAt: message.createdAt,
    chatId: message.chatId,
    attachment: message.attachment,
    user: {
      id: message.user.id,
      username: message.user.username,
      name: message.user.username,
      surname: message.user.username,
    },
    readBy: message.ReadMessage.map((r) => ({
      id: r.User.id,
      username: r.User.username,
      name: r.User.username,
      surname: r.User.username,
    })),
  };
};
