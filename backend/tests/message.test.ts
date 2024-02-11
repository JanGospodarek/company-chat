import { expect, test, describe, afterEach, beforeEach } from "bun:test";
import "../src/index";

import { databaseCleanup } from "./utils";
import {
  register,
  login,
  connect,
  createChat,
  getChats,
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

describe("Socket connection", () => {
  test("Should connect to the server", async (done) => {
    const token = (await login("test1", "Password1234")).token;

    // const socket = connect(token);
    const socket = connect(token).get();

    socket.on("connect", () => {
      expect(socket.connected).toBe(true);
      done();
    });
  });

  test("Should not connect to the server", (done) => {
    const miau = connect("miau");

    miau.connect_error((error) => {
      expect(error.message).toBe("Authentication error");
      done();
    });
  });

  test("Should send a message", async (done) => {
    const token = (await login("test1", "Password1234")).token;

    const chatID = (await createChat(token, "test2")).chatId;

    const miau = connect(token);

    miau.enterChat(chatID);
    miau.sendMessage("Hello");
    miau.onMessage((data) => {
      expect(data.content).toBe("Hello");
      done();
    });
  });

  test("Should not be able to send a message to a chat that does not exist", async (done) => {
    const token = (await login("test1", "Password1234")).token;

    const miau = connect(token);

    miau.enterChat(-1);
    miau.sendMessage("Hello");

    miau.error((data) => {
      expect(data.message).toBe("Chat does not exist");
      done();
    });
  });

  test("Should not be able to send a message with invalid content", async (done) => {
    const token = (await login("test1", "Password1234")).token;

    const chatID = (await createChat(token, "test2")).chatId;

    const miau = connect(token);
    miau.error((error) => {
      expect(error.message).toBe("Invalid content");
      done();
    });

    miau.enterChat(chatID);
    miau.sendMessage("");
  });

  test("Should not be able to send a message with invalid chatID", async (done) => {
    const token = (await login("test1", "Password1234")).token;

    const miau = connect(token);
    miau.error((error) => {
      expect(error.message).toBe("Invalid chatID");
      done();
    });

    try {
      miau.sendMessage("Hello");
    } catch (error: any) {
      expect(error.message).toBe("No active chat");
      done();
    }
  });
});
