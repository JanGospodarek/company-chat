import express from "express";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import passport from "passport";
import cors from "cors";
import { authRouter, chatRouter, mediaRouter, userRouter } from "@routes";
// import cors from "cors";
import { wsAuthenticate } from "@services/auth";
import {
  connectUser,
  disconnectUser,
  receiveMessage,
  readMessage,
} from "@services/message";

import { decryptData } from "@services/crypto";

// Check if the environment is test
const test = process.env.NODE_ENV === "test";
const port = test ? 5138 : process.env.PORT || 5000;

// Initialize the app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/users", userRouter);
app.use("/media", mediaRouter);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/status", async (req, res) => {
  res.send({ status: "ok" });
});

app.get("/test", async (req, res) => {
  res.send({ data: "tested" });
});

const io = new Server(server, {
  path: "/ws",
  cors: { origin: "*" },
});

io.use(async (socket, next) => {
  try {
    await wsAuthenticate(socket);

    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

io.on("connection_error", (err) => {
  console.log(err.context);
});

io.on("connection", async (socket) => {
  console.log("Connected");
  await connectUser(socket);

  socket.on("disconnect", async () => {
    await disconnectUser(socket.data["user"]);
  });

  socket.on("message", async (data) => {
    try {
      const decrypted = decryptData(data);

      await receiveMessage(decrypted, socket);
    } catch (error: any) {
      // socket.emit("error", { message: error.message });
      console.error(error);
    }
  });

  socket.on("read", async (data) => {
    try {
      await readMessage(data, socket);
    } catch (error: any) {
      console.error(error);
    }
  });
});
