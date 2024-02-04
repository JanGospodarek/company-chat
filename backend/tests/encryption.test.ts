import { test, expect } from "bun:test";
import "../src/index";
import JSEncrypt from "node-jsencrypt";

test("Encryption test", async () => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(process.env.RSA_PUBLIC_KEY as string);

  let params = {
    account: "testaxx",
    password: "testaxx",
    date: new Date(),
  };
  console.log(params);

  let encryptedLoginData = encrypt.encrypt(JSON.stringify(params)).toString();
  console.log("sendToServer", JSON.stringify(encryptedLoginData));

  const res = await fetch("http://localhost:5138/encrypt-test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: encryptedLoginData }),
  });
  const data = await res.json();
  console.log("client response ", data);

  expect(res.status).toBe(200);
});
