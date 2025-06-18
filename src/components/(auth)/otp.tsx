"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/loading-context";
import toast from "react-hot-toast";
import {  verifyOtpService } from "@/services/admin-services";
export function Otp() {

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router= useRouter();
  const {startLoading, stopLoading} = useLoading();

  const handlesubmitOtp = async (e:React.FormEvent) =>{
    e.preventDefault();
    if(!otp){
      toast.error("Please Enter your OTP");
      return;
    }
    setLoading(true);
    startLoading();

    try {
      const response = await verifyOtpService({otp});
      if(response.status === 200){
        toast.success(response.data.message);
        sessionStorage.setItem("otp", otp);
        router.push("/change-password");
      }
      else{
        toast.error(response.data.message || "Failed to verify OTP, Please enter coreect OTP");
      }
    } catch (error: any) {
      console.error("Error:",error);
      toast.error(error?.message || "An error occured. Please Try again.")
    }
    finally{
      setLoading(false);
      stopLoading();
    }
  };

  return (
   <>
    <form onSubmit={handlesubmitOtp} className="p-4 md:p-9 space-y-6 w-full max-w-[500px] mx-auto">
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
        <InputOTP maxLength={6} value={otp} onChange={(e)=> setOtp(e)}>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTP>
      </div>
        <Button
          type="submit"
          className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 mt-2"
        >
          Submit 
        </Button>
    </form>
   </>
  );
}
