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
  // Encrypting the data before sending it to the server
  let encryptedLoginData = encrypt.encrypt(JSON.stringify(params)).toString();
  console.log("sendToServer", JSON.stringify(encryptedLoginData));
  // Send the encrypted data to the server
  const res = await fetch("http://localhost:5138/encrypt-test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: encryptedLoginData }),
  });
  //   Decrypt the response from the server
  const data = await res.json();
  console.log("client response encrypted", data);
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(process.env.RSA_PRIVATE_KEY as string);

  const decrypted = decrypt.decrypt(data.data) as string;

  console.log("client data decrypted", JSON.parse(decrypted));

  expect(res.status).toBe(200);
});
