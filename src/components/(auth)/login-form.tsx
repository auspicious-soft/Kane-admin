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
import { loginAction } from "@/actions";
import { Eye, EyeOff } from "lucide-react";
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      // First, validate credentials with your backend
      const response = await loginAction({ email, password });

      if (response?.success) {
        // If backend validation succeeds, sign in with NextAuth
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Authentication failed");
        } else {
          toast.success("Logged in successfully");
          if (response?.data?.user?.role === "admin") {
            router.push("/dashboard");
          } else {
            toast.error("You don't have permission to the dashboard");
          }
        }
      } else if (response?.message === "Invalid password") {
        toast.error(response?.message);
      } else {
        console.error("Login failed: ", response);
        toast.error("An error occurred during login.");
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
     <form
  onSubmit={handleSubmit}
  className="p-4 md:p-9 space-y-6 w-full max-w-[500px] mx-auto"
>
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
    <div className="relative">
      <Input
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder="Your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="pr-10"
      />
      <div
        className="absolute right-4 top-2  inset-y translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff className="text-zinc-500 hover:text-zinc-300" size={18} /> : <Eye className="text-zinc-500 hover:text-zinc-300" size={18} />}
      </div>
    </div>
  </div>

  <div className="flex items-center justify-between mt-[-4px]">
   
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
