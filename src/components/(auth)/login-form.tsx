import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import Link from "next/link";

export function LoginForm() {
  return (
    <form className="p-4 md:p-9 space-y-6 w-full max-w-[500px] mx-auto">
      <div className="text-center flex flex-col gap-5 !mb-10">
        <Image
          src="/images/auth-logo.png"
          alt="Logo"
          width={155}
          height={81}
          className="m-auto"
        />
        <h1 className="text-3xl">Welcome Back</h1>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="email" className="text-sm">
          Email Address
        </Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="password" className="text-sm">
          Your Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Your Password"
          required
        />
      </div>
      <div className="flex items-center justify-between mt-[-4px]">
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Keep me logged in
          </label>
        </div>
        <a
          href="/forgot-password"
          className="text-sm text-primary underline-offset-2 hover:underline"
        >
          Forgot your password?
        </a>
      </div>
      <Link href="/dashboard" passHref>
        <Button
          type="submit"
          className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 mt-5"
        >
          Log In
        </Button>
      </Link>
    </form>
  );
}
