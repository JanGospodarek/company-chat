import { expect, test, describe, afterEach } from "bun:test";
import "../src/index";
import { register, login } from "../../shared/api";
import { databaseCleanup } from "./utils";

afterEach(async () => {
  await databaseCleanup();
});

describe("signup", () => {
  test("User can signup", async () => {
    const username = "test";
    const password = "Password1234";

    const user = await register(username, password);
    expect(user.token).toBeDefined();
  });

  test("User cannot signup with missing fields", async () => {
    const username = "test";

    try {
      await register(username, "");
    } catch (error: any) {
      expect(error.message).toBe("Missing fields");
    }
  });

  test("User cannot signup with existing username", async () => {
    const username = "test";
    const password = "Password1234";

    await register(username, password);

    try {
      await register(username, password);
    } catch (error: any) {
      expect(error.message).toBe("Username already exists");
    }
  });

  test("User cannot signup with invalid password", async () => {
    const username = "test";
    const password = "password";

    try {
      await register(username, password);
    } catch (error: any) {
      expect(error.message).toBe(
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, and 1 number"
      );
    }
  });

  test("User cannot signup with password containing username", async () => {
    const username = "test";
    const password = "testPassword1234";

    try {
      await register(username, password);
    } catch (error: any) {
      expect(error.message).toBe("Password cannot contain the username");
    }
  });
});

describe("login", () => {
  test("User can login", async () => {
    const username = "test";
    const password = "Password1234";

    await register(username, password);

    try {
      const user = await login(username, password);
      expect(user.token).toBeDefined();
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  test("User cannot login with invalid password", async () => {
    const username = "test";
    const password = "Password1234";

    await register(username, password);

    try {
      await login(username, "password");
    } catch (error: any) {
      expect(error.message).toBe("Wrong username or password");
    }
  });

  test("User cannot login with invalid username", async () => {
    const username = "test";
    const password = "Password1234";

    await register(username, password);

    try {
      await login("test2", password);
    } catch (error: any) {
      expect(error.message).toBe("Wrong username or password");
    }
  });
});

describe("auth", () => {});
