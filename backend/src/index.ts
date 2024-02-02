import express from "express";
import { Server } from "socket.io";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Prisma client
const prisma = new PrismaClient();

// Load environment variables
config();

const app = express();
const server = app.listen(5000);
const io = new Server(server);

app.get("/", async (req, res) => {
  const users = await prisma.users.findMany();
  try {
    await prisma.users.create({
      data: {
        username: "test",
        password: "test",
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      console.log("Username already exists");
    }
  }

  console.log(users);

  res.send("Hello World! superasdf");
});
