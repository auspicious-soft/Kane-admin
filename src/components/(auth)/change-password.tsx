import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

export function ChangePassword() {
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
        <h1 className="text-3xl">Change Password</h1>
      </div>

      <div className="grid gap-3">
        <Label htmlFor="password" className="text-sm">
          Enter New Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="New Password"
          required
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="password" className="text-sm">
          Confirm New Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Confirm New Password"
          required
        />
      </div>
      <Link href="/" passHref>
        <Button
          type="submit"
          className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 mt-5"
        >
          Update Password
        </Button>
      </Link>
    </form>
  );
}
