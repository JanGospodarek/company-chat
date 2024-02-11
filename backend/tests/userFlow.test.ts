import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import "../src/index";

import { databaseCleanup, sleep } from "./utils";
import {
  register,
  login,
  connect,
  createChat,
  getChats,
  Miau,
  getUsers,
} from "../../shared/api";

import type { Chat } from "../../shared/types";

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
    await register(user.username, user.password);
  }
}

beforeAll(async () => {
  await databaseCleanup();

  await createTestUsers();
});

afterAll(async () => {
  await databaseCleanup();
});

describe("New user flow", () => {
  let token: string;
  let miau: Miau;
  let targetUser: string;
  let chats: Chat[];

  test("Should connect to the server", async () => {
    const res = await fetch("http://localhost:5138/status");
    expect(res.status).toBe(200);
  });

  test("Should create a new account", async () => {
    const user = await register("test3", "Password1234");
    expect(user.username).toBe("test3");
  });

  test("Should login", async () => {
    const user = await login("test1", "Password1234");
    expect(user.username).toBe("test1");
    token = user.token;
  });

  test("Should get user chats", async () => {
    const chats = await getChats(token);
    expect(chats.length).toBe(0);
  });

  // Add api for getting all users
  test("Should get all users", async () => {
    const users = await getUsers(token);
    expect(users.length).toBe(2);

    targetUser = users[0].username;
  });

  test("Should create a chat", async () => {
    const chat = await createChat(token, "test2");
    expect(chat.name).toBe("Private Chat");
  });

  // TODO: Add api for getting messages from chat
  test("Should get messages from chat", async () => {
    const chats = await getChats(token);
    expect(chats.length).toBe(1);

    const chat = chats[0];
  });

  test("Should get active users", async (done) => {
    const token2 = (await login("test2", "Password1234")).token;
    const miau2 = connect(token2);

    miau = connect(token);
    miau.onActivity((users) => {
      expect(users.length).toBe(1);
      done();
    });
  });

  test("Should send a message (initial)", async (done) => {
    const chats = await getChats(token);
    const chat = chats[0];

    miau.enterChat(chat.chatId);

    miau.sendMessage("Hello");
    await sleep(50);
    miau.sendMessage("World");

    setTimeout(() => {
      done();
    }, 100);
  });

  test("Should get chats with messages", async () => {
    chats = await getChats(token);
    expect(chats.length).toBe(1);

    const chat = chats[0];

    expect(chat.messages.length).toBe(2);
  });
});
