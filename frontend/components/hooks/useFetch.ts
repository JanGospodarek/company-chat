import { useEffect, useState } from "react";
import { decryptData, encryptData } from "../utils/encryption";

const useFetch = async (
  url: string,
  reqData: any,
  method?: "POST" | "GET" | "PUT" | "DELETE"
) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async function () {
      try {
        const resSignup = await fetch(url, {
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
        } = (await resSignup.json()) as any;
        if (resSignup.status !== 200) {
          throw new Error(resData.data ? resData.data : "Error while fetching");
        }
        if (resData.isEncrypted) setData(decryptData(resData.data));
        else return setData(resData.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  return { data, error, loading };
};
export default useFetch;
