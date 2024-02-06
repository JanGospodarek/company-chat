import prisma from "../config/db";

export interface IUser {
  id: number;
  username: string;
  password: string;
  createdAt: Date;
}

export const registerUser = async (username: string, password: string) => {
  const user = await prisma.user.create({
    data: {
      username,
      password,
    },
  });

  return user;
};

export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  return user;
};
