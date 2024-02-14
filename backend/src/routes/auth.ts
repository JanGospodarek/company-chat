import express from "express";

import { authenticate, login } from "@services/auth";
import { register, validatePassword } from "../services/auth";
import type { User } from "@shared/types";

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const mobile = false;

  try {
    await register(username, password);

    const { user, token } = await login(username, password);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 1,
    });

    res.send({ user });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
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
