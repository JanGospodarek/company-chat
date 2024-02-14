import express from "express";
import { authenticate } from "@services/auth";
import { getChats } from "@models/chat";
import { addUsersToChat, newChat } from "@services/chat";
import { getNewUsers } from "@models/user";

import type { User } from "@shared/types";

const chatRouter = express.Router();

chatRouter.get("/", authenticate, async (req, res) => {
  const user = req.user as User;

  try {
    const chats = await getChats(user.id);

    res.send({ chats });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

/**
 * Create a new chat
 */
chatRouter.post("/new", authenticate, async (req, res) => {
  const data = req.body as {
    group: boolean;
    name?: string;
    receipient?: string;
  };

  const user = req.user as User;

  try {
    const chat = await newChat(user, data);

    res.send({ chat });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

/**
 * Get a list of users that do not have a private chat with the user
 */
chatRouter.get("/new", authenticate, async (req, res) => {
  const user = req.user as User;

  try {
    const newUsers = await getNewUsers(user.id);

    res.send({ newUsers });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

chatRouter.post("/add", authenticate, async (req, res) => {
  const data = req.body as {
    chatId: number;
    users: number[];
  };
  const user = req.user as User;

  try {
    const chat = await addUsersToChat(user, data);

    res.send({ chat });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

export default chatRouter;
