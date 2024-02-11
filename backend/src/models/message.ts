import prisma from "../config/db";

export const createMessage = async (
  chatID: number,
  senderID: number,
  content: string
) => {
  const message = await prisma.message.create({
    data: {
      content,
      chatId: chatID,
      userId: senderID,
    },
  });

  return message;
};

export const getMessages = async (chatID: number) => {
  const messages = await prisma.message.findMany({
    where: {
      chatId: chatID,
    },
  });

  return messages;
};
