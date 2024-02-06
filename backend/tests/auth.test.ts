import { expect, test, describe, afterEach } from "bun:test";
import "../src/index";
import prisma from "../src/config/db";

async function databaseCleanup() {
  await prisma.user.deleteMany();
}

afterEach(async () => {
  await databaseCleanup();
});

describe("signup", () => {
  test("User can signup", async () => {
    const username = "test";
    const password = "Password1234";

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.status !== 200) {
      const data = (await res.json()) as { error: string };

      console.error(data.error);
    }

    expect(res.status).toBe(200);
  });

  test("User cannot signup with missing fields", async () => {
    const username = "test";
    const password = "Password1234";

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    const data: { error: string } = (await res.json()) as any;

    expect(res.status).toBe(400);
    expect(data.error).toBe("Missing fields");
  });

  test("User cannot signup with existing username", async () => {
    const username = "test";
    const password = "Password1234";

    const resSignup = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (resSignup.status !== 200) {
      throw new Error("Error signing up");
    }

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data: { error: string } = (await res.json()) as any;

    expect(res.status).toBe(400);
    expect(data.error).toBe("Username already exists");
  });

  test("User cannot signup with invalid password", async () => {
    const username = "test";
    const password = "password";

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data: { error: string } = (await res.json()) as any;

    expect(res.status).toBe(400);
    expect(data.error).toBe(
      "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number"
    );
  });

  test("User cannot signup with password containing username", async () => {
    const username = "test";
    const password = "testPassword1234";

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data: { error: string } = (await res.json()) as any;

    expect(res.status).toBe(400);
    expect(data.error).toBe("Password cannot contain the username");
  });
});

describe("login", () => {
  test("User can login", async () => {
    const username = "test";
    const password = "Password1234";
    const resSignup = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
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

  test("User cannot login with invalid password", async () => {
    const username = "test";
    const password = "Password1234";

    const resSignup = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (resSignup.status !== 200) {
      throw new Error("Error signing up");
    }
    const res = await fetch("http://localhost:5138/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password: "password" }),
    });

    if (res.status !== 200) {
      const data = (await res.json()) as { error: string };
      expect(data.error).toBe("Wrong username or password");
    }

    expect(res.status).toBe(401);
  });

  test("User cannot login with invalid username", async () => {
    const username = "test";
    const password = "Password1234";
    const resSignup = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (resSignup.status !== 200) {
      throw new Error("Error signing up");
    }
    const res = await fetch("http://localhost:5138/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "test2", password }),
    });

    if (res.status !== 200) {
      const data = (await res.json()) as { error: string };
      expect(data.error).toBe("Wrong username or password");
    }

    expect(res.status).toBe(401);
  });
});

describe("auth", () => {});
