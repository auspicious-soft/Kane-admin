import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export function ForgotPassword() {
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
        <h1 className="text-3xl">Forgot Password?</h1>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="email" className="text-sm">
          Email Address
        </Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      <Link href="/otp" passHref>
        <Button
          type="submit"
          className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 mt-2"
        >
         Continue
        </Button>
      </Link>
    </form>
  );
}
