import prisma from "../config/db";
import { type User } from "../../../shared/types";

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

export async function getUsers(user: User): Promise<User[]> {
  if (!user.id) throw new Error("User not found");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
    where: {
      NOT: {
        id: user.id,
      },
    },
  });

  return users;
}
