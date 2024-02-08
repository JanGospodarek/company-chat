import { expect, test, describe, afterEach, beforeEach } from "bun:test";
import "../src/index";
import prisma from "../src/config/db";
import { io } from "socket.io-client";

async function databaseCleanup() {
  await prisma.userChat.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.user.deleteMany();
}

async function createTestUsers() {
  const users = [
    {
      username: "test1",
      password: "Password1234",
    },
    {
      username: "test2",
      password: "Password1234",
    },
  ];

  for (let user of users) {
    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (res.status !== 200) {
      const data = (await res.json()) as { error: string };
      throw new Error(data.error);
    }
  }
}

async function login(username: string, password: string) {
  let token = "";

  const res = await fetch("http://localhost:5138/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as { token: string };

  token = d.token;
  return token;
}

beforeEach(async () => {
  await createTestUsers();
});

afterEach(async () => {
  await databaseCleanup();
});

describe("Socket connection", () => {
  test("Should connect to the server", async (done) => {
    const token = await login("test1", "Password1234");

    const socket = io("http://localhost:5138", {
      withCredentials: true,
      auth: {
        token,
      },
    });
    socket.on("connect", () => {
      done();
    });
  });

  test("Should not connect to the server", (done) => {
    const socket = io("http://localhost:5138");
    socket.on("connect_error", (error) => {
      expect(error.message).toBe("Authentication error");
      done();
    });
  });
});
