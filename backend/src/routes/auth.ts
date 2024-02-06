import express from "express";
import { login, register, validatePassword } from "../services/auth";
import { decryptData, encryptData } from "../services/encryption";

const authRouter = express.Router();
authRouter.use(decryptData);

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const mobile = false;
  try {
    const token = await login(username, password, false);

    if (!token) {
      throw new Error("Error signing token");
    }

    if (!mobile) {
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
    console.log("TOKEN ON SERVER", { token });
    res.send({
      isEncrypted: false,
      data: { token },
    });
  } catch (error: any) {
    res.status(401).send({
      isEncrypted: false,
      data: { error: error.message },
    });
  }
});

authRouter.post("/register", async (req, res) => {
  const { username, password, name, surname } = req.body;
  const mobile = false;
  console.log("REGISTER", { username, password, name, surname });
  if (!username || !password || !name || !surname) {
    console.log("MISSING FIELDS");
    return res.status(400).send({ error: "Missing fields" });
  }

  try {
    validatePassword(password, username);

    await register(username, password, name, surname);

    const token = await login(username, password, mobile);

    if (!token) {
      throw new Error("Error signing token");
    }

    if (!mobile) {
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    res.send({
      isEncrypted: false,
      data: { token },
    });
  } catch (error: any) {
    res.status(400).send({
      isEncrypted: false,
      data: { error: error.message },
    });
  }
});

authRouter.get("/logout", async (req, res) => {
  res.send("logout");
});

export default authRouter;
