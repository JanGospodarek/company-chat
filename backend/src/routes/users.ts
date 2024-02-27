import express from "express";
import { authenticate } from "@services/auth";
import { getUsers } from "@models/user";

const userRouter = express.Router();

import type { User } from "@shared/types";
import { decryptMiddleware, encryptSocketData } from "@services/crypto";

userRouter.use(decryptMiddleware)

userRouter.get("/", authenticate, async (req, res) => {
  const user = req.user as User;

  try {
    const users = await getUsers(user.id);

    const encrypted = encryptSocketData(users, req.key!);

    res.send({ encrypted });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

export default userRouter;
