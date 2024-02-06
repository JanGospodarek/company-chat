"use client";

import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
export default function Home() {
  const [logged, setLogged] = useState(false);

  return (
    <main className="flex flex-col justify-center items-center gap-4 h-[100vh] w-[100vw] light text-foreground bg-background font-league">
      <div className="text-5xl  font-semibold">Team chat</div>
      {logged ? (
        <>
          <p className="text-slate-400">You are logged in as</p>
          <Button color="primary" variant="bordered">
            <Link href="/login"> Chat app</Link>
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
