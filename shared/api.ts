import * as type from "./types";

// Check if the environment is test
const test = process.env.NODE_ENV === "test";
const apiURL = test ? "http://localhost:5138" : "/api";

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

  const d = (await res.json()) as { user: type.LoggedInUser };

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

  const d = (await res.json()) as { user: type.LoggedInUser };

  return d.user;
};

export const createChat = async (token: string, receipient: string) => {
  const chatData = {
    name: "",
    group: false,
    receipient,
  };

  const res = await fetch(`${apiURL}/chat/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export const createGroupChat = async (token: string, chatName: string) => {
  const chatData = {
    name: chatName,
    group: true,
    receipient: "",
  };

  const res = await fetch(`${apiURL}/chat/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export const getChats = async (token: string) => {
  const res = await fetch(`${apiURL}/chat`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export const addUsersToChat = async (
  token: string,
  chatId: number,
  usernames: string[]
) => {
  const res = await fetch(`${apiURL}/chat/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
