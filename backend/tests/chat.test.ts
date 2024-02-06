import { expect, test, describe, afterEach, beforeEach } from "bun:test";
import "../src/index";
import prisma from "../src/config/db";

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

describe("Chat creation", () => {
  test("User can create a chat", async () => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "",
      group: false,
      receipient: "test2",
    };

    const chatRes = await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(chatData),
    });

    expect(chatRes.status).toBe(200);
    const data = (await chatRes.json()) as {
      chat: { id: number; name: string; type: string };
    };

    expect(data.chat.name).toBe("Private Chat");
    expect(data.chat.type).toBe("PRIVATE");
  });

  test("User cannot create a chat with themselves", async () => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "",
      group: false,
      receipient: "test1",
    };

    const chatRes = await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(chatData),
    });

    expect(chatRes.status).toBe(400);
    const data = (await chatRes.json()) as { error: string };

    expect(data.error).toBe("You cannot create a chat with yourself");
  });

  test("User cannot create a chat with a user that doesn't exist", async () => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "",
      group: false,
      receipient: "test3",
    };

    const chatRes = await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(chatData),
    });

    expect(chatRes.status).toBe(400);

    const data = (await chatRes.json()) as { error: string };

    expect(data.error).toBe("User not found");
  });

  test("User cannot create a chat with missing fields", async () => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "",
      group: false,
      receipient: "",
    };

    const chatRes = await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(chatData),
    });

    expect(chatRes.status).toBe(400);

    const data = (await chatRes.json()) as { error: string };

    expect(data.error).toBe("Missing fields");
  });

  test("User cannot create a chat without being logged in", async () => {
    const chatData = {
      name: "",
      group: false,
      receipient: "test2",
    };

    const chatRes = await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(chatData),
    });

    expect(chatRes.status).toBe(401);
  });
});

describe("Group chat creation", () => {
  test("User can create a group chat", async () => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "Test Group",
      group: true,
      receipient: "",
    };

    const chatRes = await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(chatData),
    });

    expect(chatRes.status).toBe(200);

    const data = (await chatRes.json()) as {
      chat: { id: number; name: string; type: string };
    };

    expect(data.chat.name).toBe("Test Group");
    expect(data.chat.type).toBe("GROUP");
  });

  test("User cannot create a group chat with missing fields", async () => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "",
      group: true,
      receipient: "",
    };

    const chatRes = await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(chatData),
    });

    expect(chatRes.status).toBe(400);

    const data = (await chatRes.json()) as { error: string };

    expect(data.error).toBe("Missing fields");
  });
});

describe("Get user chats", () => {
  test("User can get their chats", async () => {
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
      credentials: "include",
      body: JSON.stringify(chatData),
    });

    const chatRes = await fetch("http://localhost:5138/chat", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    expect(chatRes.status).toBe(200);

    const data = (await chatRes.json()) as {
      chats: { id: number; name: string; type: string }[];
    };

    expect(data.chats.length).toBe(1);
    expect(data.chats[0].name).toBe("Private Chat");
    expect(data.chats[0].type).toBe("PRIVATE");
  });

  test("User can get their group chats", async () => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "Test Group",
      group: true,
      receipient: "",
    };

    await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(chatData),
    });

    const chatRes = await fetch("http://localhost:5138/chat", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    expect(chatRes.status).toBe(200);

    const data = (await chatRes.json()) as {
      chats: { id: number; name: string; type: string }[];
    };

    expect(data.chats.length).toBe(1);
    expect(data.chats[0].name).toBe("Test Group");
    expect(data.chats[0].type).toBe("GROUP");
  });

  test("User can get multiple chats", async () => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "Test Group",
      group: true,
      receipient: "",
    };

    for (let i = 0; i < 5; i++) {
      await fetch("http://localhost:5138/chat/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(chatData),
      });
    }

    const chatRes = await fetch("http://localhost:5138/chat", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    expect(chatRes.status).toBe(200);

    const data = (await chatRes.json()) as {
      chats: { id: number; name: string; type: string }[];
    };

    expect(data.chats.length).toBe(5);
  });

  test("User cannot get chats without being logged in", async () => {
    const chatRes = await fetch("http://localhost:5138/chat", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    expect(chatRes.status).toBe(401);
  });
});

describe("Add users to chat", () => {
  test("User can add users to a chat", async () => {
    const token = await login("test1", "Password1234");

    const chatData = {
      name: "Test Group",
      group: true,
      receipient: "",
    };

    const chatRes = await fetch("http://localhost:5138/chat/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(chatData),
    });

    if (chatRes.status !== 200) {
      const data = (await chatRes.json()) as { error: string };
      throw new Error(data.error);
    }

    const data = (await chatRes.json()) as { chat: { chatId: number } };
    const chatId = data.chat.chatId;

    const addChatRes = await fetch("http://localhost:5138/chat/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify({
        chatId,
        usernames: ["test2"],
      }),
    });

    if (addChatRes.status !== 200) {
      const data = (await addChatRes.json()) as { error: string };
      throw new Error(data.error);
    }

    expect(addChatRes.status).toBe(200);
  });
});
