import type { Prisma } from "@prisma/client";
import prisma from "../config/db";
import type { PrivateChat, GroupChat } from "@shared/types";
import { parseMessage } from "./message";

type RawChat = Prisma.ChatGetPayload<{
  include: {
    Message: {
      select: {
        messageId: true;
        chatId: true;
        content: true;
        attachment: true;
        createdAt: true;
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
    };
    UserChat: {
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
 * Create a new private chat in the database
 * @param userID userID of the sender
 * @param receipientID userID of the receipient
 * @returns chatID
 */
export async function createPrivateChat(
  userId: number,
  receipientId: number
): Promise<number> {
  // Check if chat already exists
  const exists = await prisma.chat.findFirst({
    where: {
      AND: [
        { type: "PRIVATE" },
        { UserChat: { some: { userId } } },
        { UserChat: { some: { userId: receipientId } } },
      ],
    },
  });

  if (exists) {
    throw new Error("Ten czat już istnieje");
  }

  const chat = await prisma.chat.create({
    data: {
      name: "Private Chat",
      type: "PRIVATE",
      UserChat: {
        createMany: {
          data: [{ userId }, { userId: receipientId }],
        },
      },
    },
  });

  return chat.chatId;
}

/**
 * Create a new group chat in the database
 * @param name name of the group chat
 * @param userId userId of the sender
 * @returns chatID
 */
export async function createGroupChat(
  name: string,
  userId: number
): Promise<number> {
  const chat = await prisma.chat.create({
    data: {
      name,
      type: "GROUP",
      UserChat: {
        create: {
          userId,
        },
      },
    },
  });

  return chat.chatId;
}

/**
 * Get all chats for a user
 * @param userId
 * @returns array of Chats
 */
export async function getChats(
  userId: number
): Promise<(PrivateChat | GroupChat)[]> {
  const rawChats = await prisma.chat.findMany({
    where: {
      UserChat: {
        some: {
          userId,
        },
      },
    },
    include: {
      Message: {
        select: {
          messageId: true,
          chatId: true,
          content: true,
          attachment: true,
          createdAt: true,
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
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      },
      UserChat: {
        where: {
          NOT: {
            userId,
          },
        },
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

  const chats = rawChats.map((chat) => {
    return parseChat(chat);
  });

  return chats;
}

/**
 * Get a single chat by its ID
 * @param chatId ID of the chat
 * @returns Chat
 */
export async function getChat(
  chatId: number,
  userId: number
): Promise<GroupChat | PrivateChat> {
  const rawChat = await prisma.chat.findUnique({
    where: {
      chatId,
    },
    include: {
      Message: {
        select: {
          messageId: true,
          chatId: true,
          content: true,
          attachment: true,
          createdAt: true,
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
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      },
      UserChat: {
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

  if (!rawChat) {
    throw new Error("Czas nie istnieje");
  }

  if (!(await userInChat(chatId, userId))) {
    throw new Error("Użytkownik nie jest w czacie");
  }

  return parseChat(rawChat, userId);
}

/**
 * Check if a user is in a chat
 * @param chatId ID of the chat
 * @param userId ID of the user
 * @returns boolean
 */
export async function userInChat(
  chatId: number,
  userId: number
): Promise<boolean> {
  const chat = await prisma.chat.findFirst({
    where: {
      AND: [{ chatId }, { UserChat: { some: { userId } } }],
    },
  });

  return Boolean(chat);
}

/**
 * Add users to a chat
 * @param chatId ID of the chat
 * @param users array of userIDs
 * @returns chatID
 */
export async function addUsersToChat(
  chatId: number,
  users: number[]
): Promise<number> {
  const newUsers = users.map((userId) => {
    return {
      chatId,
      userId,
    };
  });

  await prisma.userChat.createMany({
    data: newUsers,
  });

  return chatId;
}

/**
 * Parse raw chat data into a Chat object
 * @param c raw chat data
 * @returns GroupChat | PrivateChat
 */
function parseChat(c: RawChat, userID?: number): GroupChat | PrivateChat {
  const messages = c.Message.map((message) => parseMessage(message));
  messages.reverse();

  if (c.type === "PRIVATE") {
    const receipient =
      c.UserChat[0].User.id === userID
        ? c.UserChat[1].User
        : c.UserChat[0].User;

    return {
      ...c,
      messages,
      receipient,
    };
  } else {
    return {
      ...c,
      messages,
      users: c.UserChat.map((user) => user.User),
    };
  }
}
