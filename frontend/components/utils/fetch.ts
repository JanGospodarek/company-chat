import { useEffect, useState } from "react";
import { decryptData, encryptData } from "../utils/encryption";

const fetchData = async (
  url: string,
  reqData: any,
  method?: "POST" | "GET" | "PUT" | "DELETE"
) => {
  try {
    const response = await fetch(url, {
      method: method ? method : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: encryptData(reqData),
      }),
    });

    const resData: {
      isEncrypted: boolean;
      data: any;
    } = (await response.json()) as any;
    if (response.status !== 200) {
      return {
        status: "error",
        data: resData.data ? resData.data : "Error while fetching",
      };
    }
    if (resData.isEncrypted) return decryptData(resData.data);
    else return resData.data;
  } catch (error) {
    return error;
  }
};
export default fetchData;
