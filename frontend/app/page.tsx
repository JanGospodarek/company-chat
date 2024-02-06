"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUsername } from "@/lib/userSlice";
import { Spinner } from "@nextui-org/react";

export default function Home() {
  const [logged, setLogged] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setLogged(true);
      setName(username);
      dispatch(setUsername(username));
    }
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center  h-[100vh] w-[100vw] light text-foreground bg-background font-league">
        <Spinner />
      </div>
    );

  return (
    <main className="flex flex-col justify-center items-center gap-4 h-[100vh] w-[100vw] light text-foreground bg-background font-league">
      <div className="text-5xl  font-semibold">Team chat</div>
      {logged ? (
        <>
          <p className="text-slate-400">You are logged in as {name}</p>
          <Button color="primary" variant="bordered">
            <Link href="/chat"> Chat app</Link>
          </Button>
        </>
      ) : (
        <>
          <p className="text-slate-400">You are not logged in!</p>
          <Button color="primary" variant="bordered">
            <Link href="/login"> Log in</Link>
          </Button>
          <Button color="primary" variant="bordered">
            <Link href="/register"> Register</Link>
          </Button>
        </>
      )}
    </main>
  );
}
