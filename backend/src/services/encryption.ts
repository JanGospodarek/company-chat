import mung from "express-mung";
import JSEncrypt from "node-jsencrypt";

const encryptData = (body, req, res) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(process.env.RSA_PUBLIC_KEY as string);

  let encryptedLoginData = encrypt.encrypt(JSON.stringify(body)).toString();

  return { data: encryptedLoginData };
};
exports = mung.json(encryptData);
