import JSEncrypt from "jsencrypt";

const encryptData = (data: any) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY as string);
  // Encrypting the data before sending it to the server
  let encryptedLoginData = encrypt.encrypt(JSON.stringify(data)).toString();
  return encryptedLoginData;
};
const decryptData = (data: any) => {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(process.env.NEXT_PUBLIC_RSA_PRIVATE_KEY as string);

  const decrypted = decrypt.decrypt(data.data) as string;

  return JSON.parse(decrypted);
};

export { encryptData, decryptData };
