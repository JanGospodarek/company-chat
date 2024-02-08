// import { test, expect } from "bun:test";
// import "../src/index";
// import { encryptData, decryptData } from "./utils";
// test("Encryption test", async () => {
//   let params = {
//     account: "testaxx",
//     password: "testaxx",
//     date: new Date(),
//   };
//   console.log(params);

//   // Send the encrypted data to the server
//   const res = await fetch("http://localhost:5138/encrypt-test", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ data: encryptData(params) }),
//   });
//   //   Decrypt the response from the server
//   const data = await res.json();
//   console.log("client response encrypted", data);
//   console.log("client response decrypted", decryptData(data));

//   expect(res.status).toBe(200);
// });
