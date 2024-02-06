import { expect, test, describe, afterEach } from "bun:test";
import "../src/index";
import prisma from "../src/config/db";
import { decryptData, encryptData } from "./utils";

async function databaseCleanup() {
  await prisma.users.deleteMany();
}

afterEach(async () => {
  await databaseCleanup();
});

describe("signup", () => {
  test("User can signup", async () => {
    const username = "test";
    const password = "Password1234";
    const name = "test";
    const surname = "test";

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password, name, surname }),
      }),
    });

    if (res.status !== 200) {
      const resData = (await res.json()) as { data: { error: string } };
      console.error(resData.data.error);
    }

    expect(res.status).toBe(200);
  });

  test("User cannot signup with missing fields", async () => {
    const username = "test";
    const password = "Password1234";
    const name = "test";

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password, name }),
      }),
    });

    const resData = (await res.json()) as { error: string };
    expect(res.status).toBe(400);
    expect(resData.error).toBe("Missing fields");
  });

  test("User cannot signup with existing username", async () => {
    const username = "test";
    const password = "Password1234";
    const name = "test";
    const surname = "test";

    const resSignup = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password, name, surname }),
      }),
    });

    if (resSignup.status !== 200) {
      throw new Error("Error signing up");
    }

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password, name, surname }),
      }),
    });

    const data: { data: { error: string } } = (await res.json()) as any;
    expect(res.status).toBe(400);
    expect(data.data.error).toBe("Username already exists");
  });

  test("User cannot signup with invalid password", async () => {
    const username = "test";
    const password = "password";
    const name = "test";
    const surname = "test";

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password, name, surname }),
      }),
    });

    const data: { data: { error: string } } = (await res.json()) as any;
    expect(res.status).toBe(400);
    expect(data.data.error).toBe(
      "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number"
    );
  });

  test("User cannot signup with password containing username", async () => {
    const username = "test";
    const password = "testPassword1234";
    const name = "test";
    const surname = "test";

    const res = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password, name, surname }),
      }),
    });

    const data: { data: { error: string } } = (await res.json()) as any;
    expect(res.status).toBe(400);
    expect(data.data.error).toBe("Password cannot contain the username");
  });
});

describe("login", () => {
  test("User can login", async () => {
    const username = "test";
    const password = "Password1234";
    const name = "test";
    const surname = "test";
    const resSignup = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password, name, surname }),
      }),
    });

    if (resSignup.status !== 200) {
      throw new Error("Error signing up");
    }
    const res = await fetch("http://localhost:5138/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password }),
      }),
    });
    const data: {
      isEncrypted: boolean;
      data: any;
    } = (await res.json()) as any;
    if (data.isEncrypted) {
      console.log("DECRYPTED:", decryptData(data.data));
    } else {
      console.log(data.data);
    }
    expect(res.status).toBe(200);
  });

  test("User cannot login with invalid password", async () => {
    const username = "test";
    const password = "Password1234";
    const name = "test";
    const surname = "test";
    const resSignup = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password, name, surname }),
      }),
    });
    if (resSignup.status !== 200) {
      throw new Error("Error signing up");
    }
    const res = await fetch("http://localhost:5138/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password: "password" }),
      }),
    });

    if (res.status !== 200) {
      const data: { data: { error: string } } = (await res.json()) as any;
      expect(data.data.error).toBe("Wrong username or password");
    }

    expect(res.status).toBe(401);
  });

  test("User cannot login with invalid username", async () => {
    const username = "test";
    const password = "Password1234";
    const name = "test";
    const surname = "test";
    const resSignup = await fetch("http://localhost:5138/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username, password, name, surname }),
      }),
    });
    if (resSignup.status !== 200) {
      throw new Error("Error signing up");
    }
    const res = await fetch("http://localhost:5138/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData({ username: "eee", password }),
      }),
    });

    if (res.status !== 200) {
      const data: { data: { error: string } } = (await res.json()) as any;
      expect(data.data.error).toBe("Wrong username or password");
    }

    expect(res.status).toBe(401);
  });
});

describe("auth", () => {});
