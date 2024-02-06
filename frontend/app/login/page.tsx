"use client";
import Alert from "@/components/reuseable/Alert";
import fetchData from "@/components/utils/fetch";
import { Input, Button } from "@nextui-org/react";
import Link from "next/link";
import { redirect } from "next/navigation";

// import CryptoJS from "crypto-js";

import { useRef, useState } from "react";
export default function Page() {
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);

  const [succeded, setSucceded] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);

  const handleLogin = async () => {
    if (email.current?.value && password.current?.value) {
      setLoading(true);
      const data = await fetchData("/api/auth/login", {
        username: email.current.value,
        password: password.current.value,
      });
      setLoading(false);
      console.log(data);
      if (data.status && data.status === "error") setError(data.error);
      else {
        // set JWT token
        setError(false);
        setSucceded(true);
        localStorage.clear();
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", email.current.value);
      }
    }
  };
  return (
    <div className=" flex flex-col justify-center items-center gap-4 h-[100vh] w-[100vw] light page">
      <h1>Dummy login</h1>

      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        className="w-1/3"
        ref={email}
      />

      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        className="w-1/3"
        ref={password}
      />
      {succeded ? (
        <Button color="success">
          <Link href="/chat" color="success">
            Go to chats
          </Link>
        </Button>
      ) : (
        <Button color="primary" variant="bordered" onClick={handleLogin}>
          {loading ? "Loading..." : "Log in"}
        </Button>
      )}
      {error && <Alert message={error} type="error" />}
    </div>
  );
}
