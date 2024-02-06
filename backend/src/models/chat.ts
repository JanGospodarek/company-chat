import prisma from "../config/db";

export const createChat = async (userID: number, receipientID: number) => {
  // Check if chat already exists
  const chat = await prisma.chat.findFirst({
    where: {
      AND: [
        { UserChat: { some: { userId: userID } } },
        { UserChat: { some: { userId: receipientID } } },
      ],
    },
  });

  if (chat) {
    throw new Error("Chat already exists");
  }

  // Create chat
  const newChat = await prisma.chat.create({
    data: {
      name: "Private Chat",
      UserChat: {
        createMany: {
          data: [{ userId: userID }, { userId: receipientID }],
        },
      },
      type: "PRIVATE",
    },
  });

  return newChat;
};

export const createGroupChat = async (name: string, userID: number) => {
  // Create chat
  const newChat = await prisma.chat.create({
    data: {
      name,
      UserChat: {
        create: {
          userId: userID,
        },
      },
      type: "GROUP",
    },
  });

  return newChat;
};

export const getUserChats = async (userID: number) => {
  const chats = await prisma.chat.findMany({
    where: {
      UserChat: {
        some: {
          userId: userID,
        },
      },
    },
  });

  return chats;
};

export const getChatByID = async (chatID: number) => {
  const chat = await prisma.chat.findUnique({
    where: {
      chatId: chatID,
    },
  });

  return chat;
};

export const userInChat = async (chatID: number, userID: number) => {
  const chat = await prisma.chat.findFirst({
    where: {
      AND: [{ chatId: chatID }, { UserChat: { some: { userId: userID } } }],
    },
  });

  return chat;
};

export const addUsersToChat = async (chatID: number, users: number[]) => {
  const newUsers = users.map((userId) => {
    return {
      chatId: chatID,
      userId,
    };
  });

  const addedUsers = await prisma.userChat.createMany({
    data: newUsers,
  });

  return addedUsers;
};
