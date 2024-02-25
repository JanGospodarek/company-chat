"use client";

import { Input, Button } from "@nextui-org/react";
import { useRef, useState } from "react";
import Alert from "@/components/reuseable/Alert";
import Link from "next/link";
import { register } from "../../../shared/api";

export default function Page() {
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const name = useRef<HTMLInputElement | null>(null);
  const surname = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);
  const [succeded, setSucceded] = useState<boolean>(false);

  const handleRegister = async () => {
    if (email.current?.value && password.current?.value) {
      setLoading(true);

      try {
        const data = await register(
          email.current.value,
          password.current.value
        );
        setLoading(false);
        setError(false);
        setSucceded(true);

        localStorage.clear();
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
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
            Chat
          </Link>
        </Button>
      ) : (
        <Button color="primary" variant="bordered" onClick={handleRegister}>
          {loading ? "Czekaj..." : "Zarejestruj się"}
        </Button>
      )}

      {error && <Alert message={error} type="error" />}
    </div>
  );
}
