// @ts-ignore
import JSEncrypt from "node-jsencrypt"; // @types/node-jsencrypt is not available
import prisma from "../src/config/db";

const encryptData = (data: any) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(process.env.RSA_PUBLIC_KEY as string);

  // Encrypting the data before sending it to the server
  let encryptedLoginData = encrypt.encrypt(JSON.stringify(data)).toString();
  return JSON.stringify(encryptedLoginData);
};
const decryptData = (data: any) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(process.env.RSA_PRIVATE_KEY as string);

  const decrypted = decrypt.decrypt(data.data) as string;

  return JSON.parse(decrypted);
};

async function databaseCleanup() {
  await prisma.message.deleteMany();
  await prisma.userChat.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.user.deleteMany();
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { encryptData, decryptData, databaseCleanup };
