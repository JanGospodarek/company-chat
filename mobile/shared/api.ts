import * as type from "./types";
import { Socket, io } from "socket.io-client";
import JSEncrypt from "jsencrypt";

// Check if the environment is test
// const test = process.env.NODE_ENV === "test";
// const apiURL = test ? "http://localhost:5000" : "/api";
// const socketURL = test ? "http://localhost:5000" : "";
// const socketPath = test ? "" : "/ws";
console.log(process.env.EXPO_PUBLIC_SERVER_IP);
const apiURL = `http://${process.env.EXPO_PUBLIC_SERVER_IP}/api`;
const socketURL = `http://${process.env.EXPO_PUBLIC_SERVER_IP}`;
const socketPath = "/ws";

const encrypt = new JSEncrypt();
encrypt.setPublicKey(process.env.EXPO_PUBLIC_PUBLIC_KEY || "");

const decrypt = new JSEncrypt();
decrypt.setPrivateKey(process.env.EXPO_PUBLIC_PRIVATE_KEY || "");

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
  console.log(data);
  const encrypted = encryptData(data);
  const res = await fetch(`${apiURL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: encrypted,
  });
  console.log(res);
  if (res.status !== 200) {
    const e = (await res.json()) as { error: string };
    console.log(e);
    throw new Error(e.error);
  }

  const d = (await res.json()) as { user: type.User };

  return d.user;
};

export const login = async (username: string, password: string) => {
  const data = { username, password };
  const encrypted = encryptData(data);

  console.log(encrypted);

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

export class Miau {
  private socket: Socket;
  private activeChat: number | null = null;

  constructor() {
    this.socket = io(socketURL, {
      withCredentials: true,
      path: socketPath,
      autoConnect: false,
      transports: ["websocket"],
    });
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
