import { test, expect } from "bun:test";
import "../src/index";

test("Server is running", async () => {
  const res = await fetch("http://localhost:5138/status");
  expect(res.status).toBe(200);
});
