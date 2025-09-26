// components/dashboard/user-profile-card.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import { USER_URLS } from "@/constants/apiUrls";
import { blockUser } from "@/services/admin-services";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/loading-context";
import dummyImg from "../../../public/images/dummyUserPic.png"
interface UserType {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  loyaltyid: string;
  gender: string;
  points: number;
  status: "Active" | "Blocked";
  stamps: string;
  date: string;
  blockReason?: string;
  reasonForBlock:string;
  profilePic:string;
}

interface UserProfileCardProps {
  user: UserType | null;
  userId: string | null;
}

export default function UserOnBarScanning({
  user,
  userId,
}: UserProfileCardProps) {

  const [blockingReason, setBlockingReason] = useState("");
  const [loading, setLoading] = useState(false);
  const {startLoading, stopLoading} = useLoading();
  
  const router = useRouter()
  const handleUpdateUserStatus = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    try {
        setLoading(true);
         startLoading();
      let response;
      if (user.status === "Blocked") {
        response = await blockUser(USER_URLS.BLOCK_USER, { id: userId });
      } else {
        if (!blockingReason.trim()) {
          toast.error("Blocking reason is required");
          return;
        }
        response = await blockUser(USER_URLS.BLOCK_USER, {
          id: userId,
         reasonForBlock:blockingReason,
        });
      }

      if (response.status === 200) {
        toast.success(
          user.status === "Blocked"
            ? "User unblocked successfully"
            : "User blocked successfully"
        ); 
          if(user.status === "Blocked"){
          router.push("/blocked-users")
          }else{
            router.push("/all-users")
          }
        setBlockingReason("");
      } else {
        toast.error(
          response?.data?.message ||
            `Error ${
              user.status === "Blocked" ? "unblocking" : "blocking"
            } user`
        );
      }
       setLoading(false);
       stopLoading();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "An error occurred while updating status"
      );
    }
    finally{
       setLoading(false);
       stopLoading();
    }
  };

  if (!user) {
    return <div>User data not available</div>;
  }
  return (
    <div className="flex flex-wrap gap-4 md:flex-nowrap">
      <div className="w-full md:w-1/4">
        <div className="bg-[#182226] rounded border border-[#2e2e2e] px-5 text-center py-7.5">
          <Avatar className="size-20 md:size-40 m-auto">
            <AvatarImage src={user.profilePic? user.profilePic : dummyImg.src} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-medium mt-4 mb-1">{user.fullName}</h3>
          <p className="text-sm font-normal">Current Status: {user.status}</p>
          <div className="flex flex-col gap-1.5 mt-7">
            <div className="text-white text-sm font-normal custom-madeTommy">
              Milestones
            </div>
            <div className="text-[#c5c5c5] text-xs font-normal">
              8/next milestone free burger
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/4 rounded border border-[#2e2e2e] px-5 py-7.5 text-[#c5c5c5] text-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-10">
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">Full Name</span>
            {user.fullName}
          </p>
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">Email</span>
            {user.email}
          </p>
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">Phone Number</span>
            {user.phoneNumber}
          </p>
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">Loyalty ID</span>
            {user.loyaltyid}
          </p>
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">Gender</span>
            {user.gender}
          </p>
          
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">
              Register Date
            </span>
            {user.date}
          </p>
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">Active Points</span>
            {user.points}
          </p>
         
        </div>

      
      </div>
    </div>
  );
}
