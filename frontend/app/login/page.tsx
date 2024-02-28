"use client";
import Alert from "@/components/reuseable/Alert";
import { Input, Button } from "@nextui-org/react";
import Link from "next/link";

import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const { logIn, user } = useAuth();
  const router = useRouter();

  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);

  const [succeded, setSucceded] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<false | string>(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, []);

  const handleLogin = async () => {
    if (email.current?.value && password.current?.value) {
      setLoading(true);

      try {
        await logIn(email.current.value, password.current.value);

        setLoading(false);
        setError(false);
        setSucceded(true);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] w-[100vw] light page bg-secondary/35">
      <div className="flex flex-col justify-center items-center gap-4 backdrop-blur-xl bg-white/30 p-12 rounded-large">
        <h1 className="font-league font-semibold text-4xl">Miau login</h1>

        <Input
          type="login"
          label="login"
          placeholder="Wpisz swój login"
          ref={email}
          className=" w-64"
        />

        <Input
          type="password"
          label="hasło"
          placeholder="Wpisz hasło"
          ref={password}
        />
        {succeded ? (
          <Button color="success">
            <Link href="/" color="success">
              Chat
            </Link>
          </Button>
        ) : (
          <Button color="primary" variant="ghost" onClick={handleLogin}>
            {loading ? "Czekaj..." : "Zaloguj się"}
          </Button>
        )}
        {error && <Alert message={error} type="error" />}
      </div>
    </div>
  );
}
