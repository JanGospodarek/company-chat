import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import type { Request } from "express";
import jwt from "jsonwebtoken";

import {
  getUserByUsername,
  getUserByUsernameLogin,
  registerUser,
} from "@models/user";
import { Socket } from "socket.io";

import { parse } from "cookie";
import type { User } from "@shared/types";

const strategy = new JWTStrategy(
  {
    secretOrKey: process.env.JWT_SECRET!,
    jwtFromRequest: (req: Request) => {
      const token = req.cookies["token"];

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

async function login(
  username: string,
  password: string
): Promise<{ user: User; token: string }> {
  if (!username || !password) {
    throw new Error("Missing fields");
  }

  let token = "";

  const user = await getUserByUsernameLogin(username);

  if (!user) {
    throw new Error("Wrong username or password");
  }

  const isPasswordValid = Bun.password.verifySync(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Wrong username or password");
  }

  const payload = {
    username: user.username,
  };

  try {
    token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
  } catch (error) {
    throw new Error("Error signing token");
  }

  const resUser: User = {
    username: user.username,
    id: user.id,
    createdAt: user.createdAt.toString(),
  };

  return { user: resUser, token };
}

const register = async (username: string, password: string) => {
  if (!username || !password) {
    throw new Error("Missing fields");
  }

  validatePassword(password, username);

  const user = await getUserByUsernameLogin(username);

  if (user) {
    throw new Error("Username already exists");
  }

  const hashedPassword = Bun.password.hashSync(password, {
    cost: 10,
    algorithm: "bcrypt",
  });

  try {
    await registerUser(username, hashedPassword);
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
  const cookieString = socket.request.headers.cookie;

  if (!cookieString) {
    throw new Error("Unauthorized");
  }

  const cookies = parse(cookieString);
  const token = cookies["token"];

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

  socket.data["user"] = user;
};

export { authenticate, wsAuthenticate, login, register, validatePassword };
