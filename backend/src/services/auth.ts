import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import type { Request } from "express";
import jwt from "jsonwebtoken";

import { loginUser } from "@services/ldap";

import { getUserByUsername, getUserByUsernameLogin } from "@models/user";
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
    throw new Error("Brak wymaganych danych logowania");
  }

  let token = "";

  const user = await getUserByUsernameLogin(username);

  if (!user) {
    throw new Error("Zły login lub hasło");
  }

  await loginUser(username, password);

  const payload = {
    username: user.username,
  };

  try {
    token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
  } catch (error) {
    throw new Error("Błąd podczas generowania tokenu");
  }

  const resUser: User = {
    username: user.username,
    id: user.id,
    name: user.name,
    surname: user.surname,
  };

  return { user: resUser, token };
}

const wsAuthenticate = async (socket: Socket) => {
  const cookieString = socket.request.headers.cookie;

  if (!cookieString) {
    throw new Error("Błąd autoryzacji");
  }

  const cookies = parse(cookieString);
  const token = cookies["token"];

  if (!token) {
    throw new Error("Błąd autoryzacji");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
    username: string;
  };

  if (!payload.username) {
    throw new Error("Błąd autoryzacji");
  }

  const user = await getUserByUsername(payload.username);

  if (!user) {
    throw new Error("Błąd autoryzacji");
  }

  socket.data["user"] = user;
};

export { authenticate, wsAuthenticate, login };
