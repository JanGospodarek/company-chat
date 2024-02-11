import { expect, test, describe, afterEach, beforeEach } from "bun:test";
import "../src/index";
import { databaseCleanup, sleep } from "./utils";
import {
  register,
  login,
  createChat,
  createGroupChat,
  getChats,
  addUsersToChat,
  connect,
} from "../../shared/api";

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

beforeEach(async () => {
  await createTestUsers();
});

afterEach(async () => {
  await databaseCleanup();
});

describe("Chat creation", () => {
  test("User can create a chat", async () => {
    const token = (await login("test1", "Password1234")).token;

    const chat = await createChat(token, "test2");

    expect(chat.name).toBe("Private Chat");
    expect(chat.type).toBe("PRIVATE");
  });

  test("User cannot create a chat with themselves", async () => {
    const token = (await login("test1", "Password1234")).token;

    try {
      await createChat(token, "test1");
    } catch (error: any) {
      expect(error.message).toBe("You cannot create a chat with yourself");
    }
  });

  test("User cannot create a chat with a user that doesn't exist", async () => {
    const token = (await login("test1", "Password1234")).token;

    try {
      await createChat(token, "test3");
    } catch (error: any) {
      expect(error.message).toBe("User not found");
    }
  });

  test("User cannot create a chat with missing fields", async () => {
    const token = (await login("test1", "Password1234")).token;

    try {
      await createChat(token, "");
    } catch (error: any) {
      expect(error.message).toBe("Missing fields");
    }
  });

  test("User cannot create a chat without being logged in", async () => {
    try {
      await createChat("", "test2");
    } catch (error: any) {
      expect(error.message).toBe("Unauthorized");
    }
  });
});

describe("Group chat creation", () => {
  test("User can create a group chat", async () => {
    const token = (await login("test1", "Password1234")).token;

    const chat = await createGroupChat(token, "Test Group");

    expect(chat.name).toBe("Test Group");
    expect(chat.type).toBe("GROUP");
  });

  test("User cannot create a group chat with missing fields", async () => {
    const token = (await login("test1", "Password1234")).token;

    try {
      await createGroupChat(token, "");
    } catch (error: any) {
      expect(error.message).toBe("Missing fields");
    }
  });
});

describe("Get user chats", () => {
  test("User can get their chats", async () => {
    const token = (await login("test1", "Password1234")).token;

    await createChat(token, "test2");

    const chats = await getChats(token);

    expect(chats.length).toBe(1);
    expect(chats[0].name).toBe("Private Chat");
    expect(chats[0].type).toBe("PRIVATE");
  });

  test("User can get their group chats", async () => {
    const token = (await login("test1", "Password1234")).token;

    await createGroupChat(token, "Test Group");

    const chats = await getChats(token);

    expect(chats.length).toBe(1);
    expect(chats[0].name).toBe("Test Group");
    expect(chats[0].type).toBe("GROUP");
  });

  test("User can get multiple chats", async () => {
    const token = (await login("test1", "Password1234")).token;

    const chatCount = 5;

    for (let i = 0; i < chatCount; i++) {
      await createGroupChat(token, "test group");
    }

    const chats = await getChats(token);

    expect(chats.length).toBe(chatCount);
  });

  test("User can get their chats with messages", async () => {
    const token1 = (await login("test1", "Password1234")).token;
    const token2 = (await login("test2", "Password1234")).token;

    const chat = await createChat(token1, "test2");

    const chatID = chat.chatId;

    const miau = connect(token1);

    miau.sendMessage(chatID, "Hello");
    await sleep(50);
    miau.sendMessage(chatID, "World");
    await sleep(50);
    miau.sendMessage(chatID, "!");
    await sleep(100);

    // Wait for messages to be sent
    const chats = await getChats(token2);

    expect(chats.length).toBe(1);

    const messages = chats[0].messages;

    expect(messages.length).toBe(3);
  });

  test("User cannot get chats without being logged in", async () => {
    try {
      await getChats("");
    } catch (error: any) {
      expect(error.message).toBe("Unauthorized");
    }
  });
});

describe("Add users to chat", () => {
  test("User can add users to a chat", async () => {
    const token = (await login("test1", "Password1234")).token;

    const createdChat = await createGroupChat(token, "Test Group");

    const chat = await addUsersToChat(token, createdChat.chatId, ["test2"]);

    expect(chat.name).toBe("Test Group");
  });

  test("Multiple users can be in the chat", async () => {
    const token1 = (await login("test1", "Password1234")).token;
    const token2 = (await login("test2", "Password1234")).token;

    const createdChat = await createGroupChat(token1, "Test Group");

    await addUsersToChat(token1, createdChat.chatId, ["test2"]);

    const chats1 = await getChats(token1);
    const chats2 = await getChats(token2);

    expect(chats1.length).toBe(1);
    expect(chats2.length).toBe(1);

    expect(chats1[0]).toMatchObject(chats2[0]);
  });
});
