import passport from "passport";
import { Strategy as JWTStrategy } from "passport-jwt";
import bcrypt from "bcrypt";
import type { Request } from "express";
import jwt from "jsonwebtoken";

import { getUserByUsername, registerUser } from "../models/user";

const strategy = new JWTStrategy(
  {
    secretOrKey: process.env.JWT_SECRET!,
    jwtFromRequest: (req: Request) => {
      const token = req.cookies["jwt"];

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
passport.use(strategy);

const authenticate = passport.authenticate("jwt", { session: false });

const login = async (
  username: string,
  password: string,
  is_mobile: boolean
) => {
  let token = "";

  const user = await getUserByUsername(username);

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
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

const register = async (
  username: string,
  password: string,
  name: string,
  surname: string
) => {
  const user = await getUserByUsername(username);

  if (user) {
    throw new Error("User already exists");
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const newUser = await registerUser(username, hashedPassword, name, surname);
  } catch (error) {
    throw new Error("Error registering user");
  }
};

export { authenticate, login, register };
