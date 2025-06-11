import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
export function Otp() {
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
        <h1 className="text-3xl">Enter OTP</h1>
      </div>

      <div className="grid gap-3">
        <InputOTP maxLength={6}>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTP>
      </div>
      <Link href="/change-password" passHref>
        <Button
          type="submit"
          className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 mt-2"
        >
          Submit 
        </Button>
      </Link>
    </form>
  );
}
