import * as type from "./types";
import { Socket, io } from "socket.io-client";

// Check if the environment is test
const test = process.env.NODE_ENV === "test";
const apiURL = test ? "http://localhost:5138" : "/api";
const socketURL = test ? "http://localhost:5138" : "";
const socketPath = test ? "" : "/ws";

export const register = async (username: string, password: string) => {
  const res = await fetch(`${apiURL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as { user: type.User };

  return d.user;
};

export const login = async (username: string, password: string) => {
  const res = await fetch(`${apiURL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
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

  const d = (await res.json()) as { user: type.LoggedInUser };

  return d.user;
};

export const createChat = async (receipient: string) => {
  const chatData = {
    name: "",
    group: false,
    receipient,
  };

  const res = await fetch(`${apiURL}/chat/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chatData),
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    chat: type.Chat;
  };

  if (d.chat.type === "PRIVATE") {
    return d.chat as type.PrivateChat;
  } else {
    return d.chat as type.GroupChat;
  }
};

export const createGroupChat = async (chatName: string) => {
  const chatData = {
    name: chatName,
    group: true,
    receipient: "",
  };

  const res = await fetch(`${apiURL}/chat/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(chatData),
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    chat: type.Chat;
  };

  if (d.chat.type === "PRIVATE") {
    return d.chat as type.PrivateChat;
  } else {
    return d.chat as type.GroupChat;
  }
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
    chats: type.Chat[];
  };

  const chats = d.chats.map((c) => {
    if (c.type === "PRIVATE") {
      return c as type.PrivateChat;
    } else {
      return c as type.GroupChat;
    }
  });

  return chats;
};

export const addUsersToChat = async (chatId: number, usernames: string[]) => {
  const res = await fetch(`${apiURL}/chat/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId, usernames }),
  });

  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  if (res.status !== 200) {
    const data = (await res.json()) as { error: string };
    throw new Error(data.error);
  }

  const d = (await res.json()) as {
    chat: type.Chat;
  };

  if (d.chat.type === "PRIVATE") {
    return d.chat as type.PrivateChat;
  } else {
    return d.chat as type.GroupChat;
  }
};

export const getUsers = async () => {
  const res = await fetch(`${apiURL}/user`, {
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

export const getNewUsers = async () => {
  const res = await fetch(`${apiURL}/user/new`, {
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

export class Miau {
  private socket: Socket;
  private activeChat: number | null = null;

  constructor() {
    this.socket = io("/", {
      withCredentials: true,
      path: socketPath,
      autoConnect: false,
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

  sendMessage(content: string) {
    const chatID = this.activeChat;

    if (chatID === null) {
      throw new Error("No active chat");
    }

    if (!this.socket.connected) {
      this.socket.once("connect", () => {
        this.socket.emit("message", { chatID, content });
      });

      return;
    }

    this.socket.emit("message", { chatID, content });
  }

  enterChat(chatID: number) {
    this.activeChat = chatID;
  }
}

export const connect = () => {
  miau.connect();
};

export const miau = new Miau();
