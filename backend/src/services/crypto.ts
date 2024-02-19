// @ts-ignore
import JSEncrypt from "node-jsencrypt";
import type { Request, Response, NextFunction } from "express";

const decrypt = new JSEncrypt();
decrypt.setPrivateKey(process.env.RSA_PRIVATE_KEY || "");

export const decryptData = (data: string) => {
  const decrypted = decrypt.decrypt(data);

  if (decrypted === false) {
    return null;
  }

  return JSON.parse(decrypted);
};

export const decryptMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body.data) {
    const decrypted = decryptData(req.body.data);

    if (decrypted) {
      req.body = decrypted;
    }
  }

  next();
};
