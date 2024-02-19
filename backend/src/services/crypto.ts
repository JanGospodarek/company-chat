// @ts-ignore
import JSEncrypt from "node-jsencrypt";

const decrypt = new JSEncrypt();
decrypt.setPrivateKey(process.env.PRIVATE_KEY || "");

export const decryptData = (data: string) => {
  const decrypted = decrypt.decrypt(data);

  if (decrypted === false) {
    return null;
  }

  return JSON.parse(decrypted);
};
