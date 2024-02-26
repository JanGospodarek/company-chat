import express from "express";
import formidable from "formidable";
import { authenticate } from "@services/auth";
import { getChats, getChat } from "@models/chat";
import {
  addUsersToChat,
  handleBaseFileUpload,
  handleFileUpload,
  newChat,
} from "@services/chat";
import { getNewUsers } from "@models/user";
import bodyParser from "body-parser";
import type { User } from "@shared/types";
import { getMessages } from "@models/message";
import { decryptMiddleware } from "@services/crypto";

const chatRouter = express.Router();

chatRouter.use(decryptMiddleware);
chatRouter.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
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

chatRouter.get("/:id/messages", authenticate, async (req, res) => {
  const { lastId } = req.query;

  const user = req.user as User;

  const id = parseInt(req.params.id);
  const last = lastId ? parseInt(lastId as string) : undefined;

  try {
    const chat = await getChat(id, user.id);

    if (!chat) {
      throw new Error("Czat nie istnieje");
    }

    const messages = await getMessages(chat.chatId, 50, last);

    res.send({ messages });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

chatRouter.post("/:id/messages/new", authenticate, async (req, res) => {
  const user = req.user as User;
  const id = parseInt(req.params.id);

  if (req.body.mobile) {
    try {
      await handleBaseFileUpload(id, user.id, req.body.content, req.body.files);

      return res.send({ status: "ok" });
    } catch (error: any) {
      return res.status(400).send({ error: error.message });
    }
  } else {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir: "./temp",
      maxFileSize: 20 * 1024 * 1024,
    });

    form.parse(req, async (err, fields, files) => {
      try {
        const content = fields["content"]?.toString();

        let filesArray = files["files"];

        if (!filesArray) {
          throw new Error("No files uploaded");
        }

        await handleFileUpload(id, user.id, content, filesArray);

        return res.send({ status: "ok" });
      } catch (error: any) {
        return res.status(400).send({ error: error.message });
      }
    });
  }
});

chatRouter.get("/:id", authenticate, async (req, res) => {
  const user = req.user as User;
  const id = parseInt(req.params.id);

  try {
    const chat = await getChat(id, user.id);

    res.send({ chat });
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
