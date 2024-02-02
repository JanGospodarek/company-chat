import express from "express";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import passport from "passport";

import { authRouter } from "./routes";
import prisma from "./config/db";

const test = process.env.NODE_ENV === "test";
const port = test ? 5138 : process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const io = new Server(server);

app.get("/status", async (req, res) => {
  const users = await prisma.users.findMany();
  res.send({ status: "ok", users });
});
