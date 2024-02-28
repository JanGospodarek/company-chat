import * as type from "./types";
import { Socket, io } from "socket.io-client";
import JSEncrypt from "jsencrypt";
import CryptoJS, { AES } from "crypto-js";

// Check if the environment is test
const test = process.env.NODE_ENV === "test";
const apiURL = test ? "http://localhost:5138" : "/api";
const socketURL = test ? "http://localhost:5138" : "";
const socketPath = test ? "" : "/ws";

const encrypt = new JSEncrypt();
encrypt.setPublicKey(process.env.NEXT_PUBLIC_PUBLIC_KEY || "");

const decrypt = new JSEncrypt();
decrypt.setPrivateKey(process.env.PRIVATE_KEY || "");

export const encryptData = (data: any) => {
  const encrypted = encrypt.encrypt(JSON.stringify(data));

  if (!encrypted) {
    throw new Error("Encryption failed");
  }

  const dataToSend = JSON.stringify({ data: encrypted });

  return dataToSend;
};

export const decryptData = (data: string) => {
  const decrypted = decrypt.decrypt(data);

  if (decrypted === false) {
    return null;
  }

  return JSON.parse(decrypted);
};

export const register = async (username: string, password: string) => {
  const data = { username, password };
  const encrypted = encryptData(data);

  const res = await fetch(`${apiURL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: encrypted,
  });

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as { user: type.User };

  return d.user;
};

export const login = async (username: string, password: string) => {
  const data = { username, password };
  const encrypted = encryptData(data);

  const res = await fetch(`${apiURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: encrypted,
  });

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as { user: type.User };

  return d.user;
};

export const logout = async () => {
  const res = await fetch(`${apiURL}/auth/logout`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  return;
};

export const authenticate = async () => {
  const res = await fetch(`${apiURL}/auth/authenticate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as { user: type.User };

  return d.user;
};

export const getChats = async () => {
  const res = await fetch(`${apiURL}/chat`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    chats: (type.GroupChat | type.PrivateChat)[];
  };

  return d.chats;
};

export const getChat = async (id: number) => {
  const res = await fetch(`${apiURL}/chat/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    chat: type.GroupChat | type.PrivateChat;
  };

  return d.chat;
};

export const getUsers = async () => {
  const res = await fetch(`${apiURL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    users: type.User[];
  };

  return d.users;
};

export const loadMoreMessages = async (chatId: number, lastId: number) => {
  const res = await fetch(
    `${apiURL}/chat/${chatId}/messages?lastId=${lastId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    messages: type.Message[];
  };

  return d.messages;
};

/**
 * New private chat
 * @param receipient The username of the receipient
 * @returns The chat ID
 */
export const newPrivateChat = async (receipient: string) => {
  const data = { receipient };
  const encrypted = encryptData(data);

  const res = await fetch(`${apiURL}/chat/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: encrypted,
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    chat: number;
  };

  return d.chat;
};

/**
 * New group chat
 * @param name The name of the chat
 * @returns The chat ID
 */
export const newGroupChat = async (name: string) => {
  const data = { name };
  const encrypted = encryptData(data);

  const res = await fetch(`${apiURL}/chat/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: encrypted,
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    chat: number;
  };

  return d.chat;
};

/**
 * Get a list of users that do not have a private chat with the user
 * @returns A list of users
 */
export const newPrivateChatList = async () => {
  const res = await fetch(`${apiURL}/chat/new`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    newUsers: type.User[];
  };

  return d.newUsers;
};

/**
 * Add users to a group chat
 * @param chatId The ID of the chat
 * @param users The IDs of the users to add
 * @returns The chat ID
 */
export const addUsersToChat = async (chatId: number, users: number[]) => {
  const data = { chatId, users };
  const encrypted = encryptData(data);

  const res = await fetch(`${apiURL}/chat/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: encrypted,
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    chat: number;
  };

  return d.chat;
};

/**
 * Send a message with an attachment
 */
export const sendMessageWithAttachment = async (
  chatId: number,
  content: string,
  files: File[]
) => {
  const formData = new FormData();

  formData.append("content", content);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await fetch(`${apiURL}/chat/${chatId}/messages/new`, {
    method: "POST",
    body: formData,
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }
};

export const loadAttachments = async (url: string, messageId: number) => {
  const res = await fetch(`${apiURL}/${url}?messageId=${messageId}`, {
    method: "GET",
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    media: type.Attachment[];
  };

  return d.media;
};

export const encryptSocketData = (data: any, key: string) => {
  const encrypted = AES.encrypt(data, key);

  return encrypted.toString();
};

export const decryptSocketData = (data: string, key: string) => {
  const decrypted = AES.decrypt(data, key);

  const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

  return JSON.parse(decryptedString);
};

export class Miau {
  private socket: Socket;
  private activeChat: number | null = null;
  private key: string | null = null;

  constructor() {
    this.socket = io("/", {
      withCredentials: true,
      path: socketPath,
      autoConnect: false,
    });

    this.key = this.generateKey();

    this.socket.on("connect", () => {
      this.sendKey();
    });
  }

  private generateKey() {
    const key = CryptoJS.lib.WordArray.random(16); // 128 bits

    return key.toString();
  }

  connect() {
    this.socket.connect();
  }

  /**
   * Get the socket
   * @returns The socket
   */
  get() {
    return this.socket;
  }

  sendKey() {
    if (this.key === null) {
      throw new Error("Key is null");
    }

    const encrypted = encrypt.encrypt(this.key);

    console.log(encrypted);

    this.socket.emit("key", encrypted);
  }

  error(cb: (error: { message: string }) => void) {
    this.socket.on("error", cb);
  }

  connect_error(cb: (error: Error) => void) {
    this.socket.on("connect_error", cb);
  }

  onMessage(cb: (data: type.Message) => void) {
    this.socket.on("message", cb);
  }

  onActivity(cb: (data: type.User[]) => void) {
    this.socket.on("activity", cb);
  }

  onNewChat(cb: (chatId: number) => void) {
    this.socket.on("newChat", cb);
  }

  onReadMessage(cb: (message: type.Message) => void) {
    this.socket.on("read", cb);
  }

  sendMessage(content: string) {
    const chatID = this.activeChat;

    const data = { chatID, content };
    const encrypted = encrypt.encrypt(JSON.stringify(data));

    if (chatID === null) {
      throw new Error("No active chat");
    }

    if (!this.socket.connected) {
      this.socket.once("connect", () => {
        this.socket.emit("message", encrypted);
      });

      return;
    }

    this.socket.emit("message", encrypted);
  }

  markMessageAsRead(messageId: number) {
    this.socket.emit("read", { messageId });
  }

  enterChat(chatID: number) {
    this.activeChat = chatID;
  }
}

export const connect = () => {
  miau.connect();
};

export const miau = new Miau();
