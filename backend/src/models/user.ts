import type { Prisma } from "@prisma/client";
import prisma from "../config/db";
import type { User } from "@shared/types";

export type RawUser = Prisma.UserGetPayload<{}>;

/**
 * Register a new user in the database
 * @param username username
 * @param hash password hash
 * @returns userID
 */
export async function registerUser(
  username: string,
  hash: string
): Promise<number> {
  const user = await prisma.user.create({
    data: {
      username,
      password: hash,
    },
  });

  return user.id;
}

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
      createdAt: true,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
}

/**
 * Get a user by their username (login)
 */
export async function getUserByUsernameLogin(
  username: string
): Promise<RawUser> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) throw new Error("User not found");

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
      createdAt: true,
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
