import express from "express";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
app.use(cors());
const server = app.listen(5000);
const io = new Server(server);

app.get("/", (req, res) => {
  console.log("Hello World!");
  res.send("Hello World! asdfa");
});

app.get("/test", (req, res) => {
  res.send("test");
});
app.post("/login", (req, res) => {
  res.send("login");
});
