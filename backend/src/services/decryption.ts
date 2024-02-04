import { type Request, type Response, type NextFunction } from "express";
import JSEncrypt from "node-jsencrypt";
const decryptData = (req: Request, res: Response, next: NextFunction) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(process.env.RSA_PRIVATE_KEY as string);

  let serverGetData = decrypt.decrypt(req.body.data) as string;

  req.body = JSON.parse(serverGetData);

  next();
};

export { decryptData };
