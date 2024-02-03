import { expect, test, describe } from "bun:test";
import "../src/index";
import prisma from "../src/config/db";

async function databaseCleanup() {
  await prisma.users.deleteMany();
}

describe("signup", () => {
  test("User can signup", async () => {
    await databaseCleanup();

    const username = "test";
    const password = "test";
    const name = "test";
    const surname = "test";

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, name, surname }),
    });

    const data = await res.json();

    expect(res.status).toBe(200);
  });

  test("User cannot signup with missing fields", async () => {
    await databaseCleanup();

    const username = "test";
    const password = "test";
    const name = "test";

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, name }),
    });

    const data: { error: string } = (await res.json()) as any;

    expect(res.status).toBe(400);
    expect(data.error).toBe("Missing fields");
  });

  test("User cannot signup with existing username", async () => {
    await databaseCleanup();

    const username = "test";
    const password = "test";
    const name = "test";
    const surname = "test";

    const resSignup = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, name, surname }),
    });

    if (resSignup.status !== 200) {
      throw new Error("Error signing up");
    }

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, name, surname }),
    });

    const data: { error: string } = (await res.json()) as any;

    expect(res.status).toBe(400);
    expect(data.error).toBe("Username already exists");
  });
});

describe("login", () => {
  test("User can login", async () => {
    await databaseCleanup();

    const username = "test";
    const password = "test";
    const name = "test";
    const surname = "test";

    const resSignup = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, name, surname }),
    });

    if (resSignup.status !== 200) {
      throw new Error("Error signing up");
    }

    const res = await fetch("http://localhost:5138/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    expect(res.status).toBe(200);
  });
});

describe("auth", () => {});
