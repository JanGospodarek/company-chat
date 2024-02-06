import express from "express";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import passport from "passport";

import { authRouter } from "./routes";
import prisma from "./config/db";
import cors from "cors";
import { decryptData, encryptData } from "./services/encryption";
const test = process.env.NODE_ENV === "test";
const port = test ? 5138 : process.env.PORT || 5000;

const app = express();

// Middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

app.use(cors());
// Routes
app.options("*", cors());
// app.options("*", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   if (req.method === "OPTIONS") {
//     // Set the necessary headers for preflight request
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, PATCH"
//     ); // Specify the allowed HTTP methods
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     ); // Specify the allowed headers
//     res.writeHead(204); // Send a successful response without any content
//     res.end();
//     return;
//   }
// });

app.use("/auth", authRouter);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const io = new Server(server);

app.get("/status", async (req, res) => {
  const users = await prisma.users.findMany();
  res.send({ status: "ok", users });
});

// app.post("/encrypt-test", async (req, res) => {
//   console.log("req.body after mid", req.body);
//   res.send(encryptData(req.body));
// });
