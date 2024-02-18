import express from "express";
import { authenticate } from "@services/auth";

import { getChats, getChat, userInChat } from "@models/chat";

import type { User } from "@shared/types";
import { getMessage } from "@models/message";
import { getMedia } from "@models/media";

const mediaRouter = express.Router();

mediaRouter.get("/uploads/*", authenticate, async (req, res) => {
  const url = decodeURIComponent(req.url.split("/uploads/")[1]);

  if (!url) {
    res.status(400).send({ error: "Missing url" });
    return;
  }

  const filePath = `uploads/${url}`;

  res.sendFile(filePath, { root: "." });
});

mediaRouter.get("/:url", authenticate, async (req, res) => {
  const user = req.user as User;

  const url = req.params.url;
  const messageId = parseInt(req.query.messageId as string);

  if (!url) {
    res.status(400).send({ error: "Missing url" });
    return;
  }

  if (isNaN(messageId)) {
    res.status(400).send({ error: "Invalid messageId" });
    return;
  }

  try {
    const message = await getMessage(messageId);

    if (!userInChat(message.chatId, user.id)) {
      throw new Error("User not in chat");
    }

    const media = await getMedia(url);

    if (!media) {
      throw new Error("Media not found");
    }

    res.send({ media });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

export default mediaRouter;
