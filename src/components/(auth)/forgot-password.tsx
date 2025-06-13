"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postApi } from "@/utils/api";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { ButtonLoader } from "@/components/ui/loader";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/loading-context";
import { AUTH_URLS } from "@/constants/apiUrls";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const forgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setLoading(true);
    startLoading();
    
    try {
      const response = await postApi(`${AUTH_URLS.FORGOT_PASSWORD}`, { email });
      
      if (response.status === 200) {
        toast.success(response.data.message);
        router.push("/otp");
      } else {
        toast.error(response.data?.message || "Failed to send reset link");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };
  
  return (
    <form onSubmit={forgotPassword} className="p-4 md:p-9 space-y-6 w-full max-w-[500px] mx-auto">
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
        <Input 
          id="email" 
          type="email" 
          placeholder="m@example.com" 
          required 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
      </div>
      
      <Button
        type="submit"
        className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 mt-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <ButtonLoader color="#0a0e11" />
            Sending...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </form>
  );
}
