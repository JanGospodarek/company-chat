import express from "express";
import { Server, type Socket } from "socket.io";
import cookieParser from "cookie-parser";
import passport from "passport";

import { authRouter, chatRouter } from "./routes";
import { decryptData, encryptData } from "./services/encryption";
import { wsAuthenticate } from "./services/auth";

// Check if the environment is test
const test = process.env.NODE_ENV === "test";
const port = test ? 5138 : process.env.PORT || 5000;

// Initialize the app
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/encrypt-test", decryptData);

const server = app.listen(port);

app.get("/status", async (req, res) => {
  res.send({ status: "ok" });
});

const io = new Server(server);
const socketMap = new Map<number, Socket>();

io.use(async (socket, next) => {
  try {
    const user = await wsAuthenticate(socket);

    socket.data["user"] = user;

    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

io.on("connection", async (socket) => {
  console.log(socket.data["user"]);
});
