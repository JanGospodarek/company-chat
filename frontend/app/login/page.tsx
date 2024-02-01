import { Input, Button } from "@nextui-org/react";
export default function Page() {
  return (
    <main className=" flex flex-col justify-center items-center gap-4 h-[100vh] w-[100vw] light text-foreground bg-background">
      <h1>Dummy login</h1>

      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        className="w-1/3"
      />
      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        className="w-1/3"
      />
      <Button color="success" variant="bordered">
        Log in
      </Button>
    </main>
  );
}
