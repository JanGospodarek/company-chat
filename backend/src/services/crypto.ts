// @ts-ignore
import JSEncrypt from "node-jsencrypt";
import type { Request, Response, NextFunction } from "express";
import CryptoJS, { AES } from "crypto-js";

const decrypt = new JSEncrypt();
decrypt.setPrivateKey(process.env.RSA_PRIVATE_KEY || "");

declare global {
  namespace Express {
    interface Request {
      key: string | undefined;
    }
  }
}

export const decryptData = (data: string) => {
  const decrypted = decrypt.decrypt(data);

  if (decrypted === false) {
    return null;
  }

  return JSON.parse(decrypted);
};

export const decryptKey = (key: string) => {
  const decrypted = decrypt.decrypt(key);

  if (decrypted === false) {
    return null;
  }

  return decrypted;
};

export const decryptMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "GET") {
    if (req.headers.keys) {
      const key = req.headers.keys as string;

      req.key = decryptKey(key);
    }

    if (!req.key) {
      res.status(401).send({ error: "Błąd autoryzacji" });
      return;
    }
  } else {
    if (req.body.data) {
      const decrypted = decryptData(req.body.data);

      if (decrypted && decrypted.data) {
        req.body = decrypted.data;
      }
      if (decrypted && decrypted.key) {
        req.key = decrypted.key;
      }
    }

    if (!req.key) {
      res.status(401).send({ error: "Błąd autoryzacji" });
      return;
    }
  }

  next();
};

export const encryptSocketData = (data: any, key: string) => {
  const encrypted = AES.encrypt(JSON.stringify(data), key);

  return encrypted.toString();
};

export const decryptSocketData = (data: string, key: string) => {
  const decryptedData = AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);

  return JSON.parse(decryptedData);
};

export const parseKey = (key: string) => {
  const parsed = CryptoJS.enc.Utf8.parse(key).toString(CryptoJS.enc.Utf8);

  return parsed;
};
