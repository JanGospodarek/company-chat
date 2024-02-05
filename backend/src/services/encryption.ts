import { type Request, type Response, type NextFunction } from "express";
import JSEncrypt from "node-jsencrypt";

const decryptData = (req: Request, res: Response, next: NextFunction) => {
  // Decrypt the data from the client
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(process.env.RSA_PRIVATE_KEY as string);

  const decrypted = decrypt.decrypt(req.body.data) as string;

  req.body = JSON.parse(decrypted);

  next();
};

const encryptData = (data: any) => {
  // Encrypt the data before sending it to the client
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(process.env.RSA_PUBLIC_KEY as string);
  const encrypted = encrypt.encrypt(JSON.stringify(data)).toString();

  return { data: encrypted };
};
export { decryptData, encryptData };
