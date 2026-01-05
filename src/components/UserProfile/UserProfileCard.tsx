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
  totalStampsCollected:number
}

interface UserProfileCardProps {
  user: UserType | null;
  userId: string | null;
}

export default function UserProfileCard({
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
            <AvatarImage src={user.profilePic? user.profilePic : dummyImg.src} className="object-fit" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-medium mt-4 mb-1">{user.fullName}</h3>
          <p className="text-sm font-normal">Current Status: {user.status}</p>
          <div className="flex flex-col gap-1.5 mt-7">
            <div className="text-white text-sm font-normal custom-madeTommy">
            </div>
            <div className="text-[#c5c5c5] text-xs pb-2 font-normal">
             
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
          {/* <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">Phone Number</span>
            {user.phoneNumber}
          </p> */}
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">Loyalty ID</span>
            {user.loyaltyid}
          </p>
          {/* <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">Gender</span>
            {user.gender}
          </p> */}
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">Total Points</span>
            {user.points}
          </p>
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">
              Total Stamps Collected
            </span>
            {user.totalStampsCollected}
          </p>
          <p className="flex flex-col gap-3 text-xs">
            <span className="text-white text-sm font-normal">
              Register Date
            </span>
            {user.date}
          </p>
          {user.status === "Blocked" && user.reasonForBlock && (
            <p className="flex flex-col gap-3 text-xs">
              <span className="text-white text-sm font-normal">
                Block Reason
              </span>
              {user.reasonForBlock}
            </p>
          )}
        </div>

        <AlertDialog>
          <AlertDialogTrigger
            className={`${
              user.status === "Blocked" ? "bg-[#298400]" : "bg-[#b40000]"
            } cursor-pointer rounded inline-flex justify-center items-center text-sm font-normal py-2.5 px-7`}
          >
            {user.status === "Blocked" ? "Unblock User" : "Block User"}
          </AlertDialogTrigger>
          <AlertDialogContent className="border-0 bg-[#182226] py-10 md:px-14 md:!max-w-[590px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="hide" />
              <AlertDialogDescription className="text-center text-white text-lg font-normal opacity-80">
                {user.status === "Blocked"
                  ? "Are you sure you want to Unblock this account?"
                  : "Are you sure you want to block this account?"}
              </AlertDialogDescription>
              {user.status !== "Blocked" && (
                <div className="mt-4">
                  <Label className="text-white text-sm font-normal mb-2">
                    Reason for Blocking
                  </Label>
                  <Textarea
                    value={blockingReason}
                    onChange={(e) => setBlockingReason(e.target.value)}
                    className="h-[100px] !bg-[#0a0e11] rounded border border-[#2e2e2e]"
                  />
                </div>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter className="!justify-center items-center mt-5">
              <AlertDialogCancel className="w-full shrink-1 py-3 px-7 h-auto border-0 cursor-pointer !bg-[#e4bc84] rounded-lg !text-[#0a0e11] text-sm">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleUpdateUserStatus}
                className={`w-full shrink-1 py-3 px-7 h-auto border-0 cursor-pointer rounded-lg !text-white text-sm ${
                  user.status === "Blocked" ? "!bg-[#298400]" : "!bg-[#b40000]"
                }`}
              >
                {user.status === "Blocked" ? "Yes, Unblock" : "Yes, Block"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
