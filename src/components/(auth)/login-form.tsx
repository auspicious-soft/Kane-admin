"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "../ui/checkbox";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useLoading } from "@/context/loading-context";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { startLoading, stopLoading } = useLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setLoading(true);
     startLoading();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
  
      if (result?.error) {
        console.error("Login error:", result.error);
        toast.error("Invalid credentials");
      } else if (result?.ok) {
        toast.success("Login successful");
        
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();                                                       
        }, 500);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
      stopLoading();

    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="p-4 md:p-9 space-y-6 w-full max-w-[500px] mx-auto">
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
        <Input 
          id="email" 
          type="email" 
          placeholder="m@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="password" className="text-sm">
          Your Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="flex items-center justify-between mt-[-4px]">
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
      
      <Button
        type="submit"
        className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 mt-5"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Log In"}
      </Button>
    </form>
    </>
    
  );
}
