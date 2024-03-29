import type { Prisma } from "@prisma/client";
import prisma from "../config/db";
import type { User } from "@shared/types";

export type RawUser = Prisma.UserGetPayload<{}>;

/**
 * Get a user by their username
 * @param username  username
 * @returns User
 */
export async function getUserByUsername(username: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      name: true,
      surname: true,
    },
  });

  if (!user) throw new Error("Użytkownik nie istnieje");

  return user;
}

/**
 * Get a user by their username (login)
 */
export async function getUserByUsernameLogin(
  username: string
): Promise<RawUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return user;
}

/**
 * Get a list of users that do not have a private chat with the user
 * @param user
 * @returns array of Users
 */
export async function getNewUsers(userId: number): Promise<User[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      surname: true,
    },
    where: {
      AND: [
        {
          NOT: {
            id: userId,
          },
        },
        {
          NOT: {
            UserChat: {
              some: {
                Chat: {
                  type: "PRIVATE",
                  UserChat: {
                    some: {
                      userId,
                    },
                  },
                },
              },
            },
          },
        },
      ],
    },
  });

  return users;
}

export async function getUsers(userId: number): Promise<User[]> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      surname: true,
    },
    where: {
      NOT: {
        id: userId,
      },
    },
  });

  return users;
}
