import { expect, test, describe, afterEach, beforeEach } from "bun:test";
import "../src/index";
import "../../shared/api";
import prisma from "../src/config/db";
import { io } from "socket.io-client";

async function databaseCleanup() {
  await prisma.message.deleteMany();
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
      expect(socket.connected).toBe(true);
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

  test("Should send a message", async (done) => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "",
      group: false,
      receipient: "test2",
    };

    await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(chatData),
    });

    const chats = await fetch("http://localhost:5138/chat", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (chats.status !== 200) {
      const data = (await chats.json()) as { error: string };
      throw new Error(data.error);
    }

    const data = (await chats.json()) as { chats: { chatId: number }[] };

    const chatID = data.chats[0].chatId;

    const socket = io("http://localhost:5138", {
      withCredentials: true,
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      socket.emit("message", { chatID, content: "Hello" });
    });

    socket.on("message", (data) => {
      expect(data.content).toBe("Hello");
      done();
    });
  });

  test("Should not be able to send a message to a chat that does not exist", async (done) => {
    const token = await login("test1", "Password1234");

    const socket = io("http://localhost:5138", {
      withCredentials: true,
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      socket.emit("message", { chatID: 1, content: "Hello" });
    });

    socket.on("error", (data) => {
      expect(data.message).toBe("Chat does not exist");
      done();
    });
  });

  test("Should not be able to send a message with invalid data", async (done) => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "",
      group: false,
      receipient: "test2",
    };

    await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(chatData),
    });

    const chats = await fetch("http://localhost:5138/chat", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (chats.status !== 200) {
      const data = (await chats.json()) as { error: string };
      throw new Error(data.error);
    }
  });
});
