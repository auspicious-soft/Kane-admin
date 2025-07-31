"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoading } from "@/context/loading-context";
import { resetUserPassword } from "@/services/admin-services";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = sessionStorage.getItem("otp");
    if (!otp) {
      toast.error("Session expired. Please verify OTP again.");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter your new password");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Password does not match. Please enter correct password");
      return;
    }

    setLoading(true);
    startLoading();
    try {
      const response = await resetUserPassword({
        password: newPassword,
        otp,
      });
      if (response.status === 200) {
        toast.success(
          response.data.message || "Password Updated Successfully."
        );
        sessionStorage.removeItem("otp");
        router.push("/");
      } else {
        toast.error(
          response?.data?.message ||
            " Failed to update Password, please try again."
        );
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.message || "An error occured. Please try again.");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };
  return (
    <>
      <form
        onSubmit={handleChangePassword}
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
          <h1 className="text-3xl">Change Password</h1>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password" className="text-sm">
            Enter New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div
              className="absolute right-4 top-2  inset-y translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff
                  className="text-zinc-500 hover:text-zinc-300"
                  size={18}
                />
              ) : (
                <Eye className="text-zinc-500 hover:text-zinc-300" size={18} />
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password" className="text-sm">
            Confirm New Password
          </Label>
          <div className="relative">
            <Input
              id="password"
             type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <div
              className="absolute right-4 top-2  inset-y translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <EyeOff
                  className="text-zinc-500 hover:text-zinc-300"
                  size={18}
                />
              ) : (
                <Eye className="text-zinc-500 hover:text-zinc-300" size={18} />
              )}
            </div>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 mt-2"
        >
          Update Password
        </Button>

        <div className="flex items-center justify-center gap-2  mt-[-4px] font-normal">
         <span> Remember Password? </span>
          <a
            href="/"
            className="text-m text-[#E4BC84] underline-offset-2 hover:underline "
          >
            Login
          </a>
        </div>

      </form>
    </>
  );
}
