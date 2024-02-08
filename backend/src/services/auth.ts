import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import bcrypt from "bcrypt";
import type { Request } from "express";
import jwt from "jsonwebtoken";

import { getUserByUsername, registerUser } from "../models/user";
import { Socket } from "socket.io";

const strategy = new JWTStrategy(
  {
    secretOrKey: process.env.JWT_SECRET!,
    jwtFromRequest: (req: Request) => {
      const token = req.cookies["jwt"];

      if (process.env.NODE_ENV === "test") {
        const header = req.headers.authorization;

        if (header) {
          return header.split(" ")[1];
        }
      }

      if (token) {
        return token;
      }

      return null;
    },
  },
  async (payload: { username: string }, done) => {
    const user = await getUserByUsername(payload.username);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  }
);
passport.use("jwt", strategy);

const authenticate = passport.authenticate("jwt", {
  session: false,
  assignProperty: "user",
});

const login = async (
  username: string,
  password: string,
  is_mobile: boolean
) => {
  let token = "";

  const user = await getUserByUsername(username);

  if (!user) {
    throw new Error("Wrong username or password");
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Wrong username or password");
  }

  const payload = {
    username: user.username,
  };

  // If the user is using a mobile device, the token will not expire
  const expiresIn = is_mobile ? "365d" : "1d";

  try {
    token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn,
    });
  } catch (error) {
    throw new Error("Error signing token");
  }

  return token;
};

const register = async (username: string, password: string) => {
  const user = await getUserByUsername(username);

  if (user) {
    throw new Error("Username already exists");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const newUser = await registerUser(username, hashedPassword);
  } catch (error) {
    throw new Error("Error registering user");
  }
};

const validatePassword = (password: string, username: string) => {
  // Password must be at least 8 characters long and contain at least one letter and one number and one uppercase letter
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/gm;

  if (!regex.test(password)) {
    throw new Error(
      "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number"
    );
  }

  // Password cannot contain the username
  if (password.includes(username)) {
    throw new Error("Password cannot contain the username");
  }
};

const wsAuthenticate = async (socket: Socket) => {
  const token = socket.handshake.auth["token"];

  if (!token) {
    throw new Error("Unauthorized");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    username: string;
  };

  if (!payload.username) {
    throw new Error("Unauthorized");
  }

  const user = await getUserByUsername(payload.username);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
};

export { authenticate, wsAuthenticate, login, register, validatePassword };
