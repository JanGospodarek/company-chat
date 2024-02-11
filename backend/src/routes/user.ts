import express from "express";
import { authenticate } from "../services/auth";
import { getUsers } from "../models/user";
import type { User } from "../../../shared/types";

const userRouter = express.Router();

userRouter.get("/", authenticate, async (req, res) => {
  const users = await getUsers(req.user as User);

  res.send({ users });
});

export default userRouter;
