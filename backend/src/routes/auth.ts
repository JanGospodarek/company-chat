import express from "express";
import { login, register, validatePassword } from "../services/auth";

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const mobile = false;

  try {
    const user = await login(username, password, mobile);

    res.send({ user });
  } catch (error: any) {
    res.status(401).send({ error: error.message });
  }
});

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const mobile = false;

  if (!username || !password) {
    return res.status(400).send({ error: "Missing fields" });
  }

  try {
    validatePassword(password, username);

    await register(username, password);

    const user = await login(username, password, mobile);

    res.send({ user });
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
});

authRouter.get("/logout", async (req, res) => {
  res.send("logout");
});

export default authRouter;
