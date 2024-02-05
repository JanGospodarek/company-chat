"use client";
import { Input, Button } from "@nextui-org/react";

// import CryptoJS from "crypto-js";

import { useRef } from "react";
export default function Page() {
  const email = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);
  const handleLogin = async () => {
    if (email.current && password.current) {
      try {
        // const res = await fetch("http://localhost:5000/login", {
        //   method: "POST",
        //   body: JSON.stringify({
        //     email: email.current.value,
        //     password: password.current.value,
        //   }),
        // });
        // const data = await res.json();
        // console.log(data);
      } catch (error) {}
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
      <Button color="success" variant="bordered" onClick={handleLogin}>
        Log in
      </Button>
    </div>
  );
}
