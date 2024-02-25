import express from "express";

import { authenticate, login } from "@services/auth";
import type { User } from "@shared/types";
import { decryptMiddleware } from "@services/crypto";
import cors from "cors";
const authRouter = express.Router();

authRouter.use(decryptMiddleware);
authRouter.use(cors());

authRouter.post("/login", async (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;
  try {
    const { user, token } = await login(username, password);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });
    res.send({ user });
  } catch (error: any) {
    res.status(401).send({ error: error.message });
  }
});

authRouter.post("/authenticate", authenticate, async (req, res) => {
  const user = req.user as User;

  if (!user) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  return res.send({ user });
});

authRouter.get("/logout", async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0,
  });
  res.send({ status: "ok" });
});

export default authRouter;
