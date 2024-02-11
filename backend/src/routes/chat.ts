import express from "express";
import { createChat, addUsersToChat, getChats } from "../services/chat";
import { authenticate } from "../services/auth";
import type { IUser } from "../models/user";

const chatRouter = express.Router();

chatRouter.get("/", authenticate, async (req, res) => {
  const user = req.user as IUser;

  try {
    const chats = await getChats(user.id);

    res.send({ chats });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

chatRouter.post("/create", authenticate, async (req, res) => {
  const {
    name,
    group,
    receipient,
  }: {
    name: string | undefined;
    group: boolean;
    receipient: string | undefined;
  } = req.body;

  const user = req.user;

  try {
    const chat = await createChat(user as IUser, group, name, receipient);

    res.send({ chat });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

chatRouter.post("/add", authenticate, async (req, res) => {
  const { chatId, usernames }: { chatId: number; usernames: string[] } =
    req.body;
  const user = req.user as IUser;

  try {
    const chat = await addUsersToChat(chatId, usernames, user.id);

    res.send({ chat });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

export default chatRouter;
