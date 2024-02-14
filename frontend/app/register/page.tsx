"use client";

import { Input, Button } from "@nextui-org/react";
import fetchData from "@/components/utils/fetch";
import { useRef, useState } from "react";
import Alert from "@/components/reuseable/Alert";
import Link from "next/link";
export default function Page() {
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const name = useRef<HTMLInputElement | null>(null);
  const surname = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const [succeded, setSucceded] = useState<boolean>(false);

  const handleRegister = async () => {
    if (
      email.current?.value &&
      password.current?.value &&
      name.current?.value &&
      surname.current?.value
    ) {
      setLoading(true);
      const data = await fetchData("/api/auth/register", {
        username: email.current.value,
        password: password.current.value,
        name: name.current.value,
        surname: surname.current.value,
      });
      setLoading(false);
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
      <h1>Dummy register</h1>

      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        className="w-1/3"
        ref={email}
      />
      <Input
        label="Name"
        placeholder="Enter your name"
        className="w-1/3"
        ref={name}
      />
      <Input
        label="Surname"
        placeholder="Enter your surname"
        className="w-1/3"
        ref={surname}
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
        <Button color="primary" variant="bordered" onClick={handleRegister}>
          {loading ? "Loading..." : "Register"}
        </Button>
      )}

      {error && <Alert message={error} type="error" />}
    </div>
  );
}