import prisma from "../config/db";

export const registerUser = async (
  username: string,
  password: string,
  name: string,
  surname: string
) => {
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
