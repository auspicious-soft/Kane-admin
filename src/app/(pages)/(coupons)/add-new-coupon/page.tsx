"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COUPON_URLS } from "@/constants/apiUrls";
import { useLoading } from "@/context/loading-context";
import { createCoupon } from "@/services/admin-services";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const Page = () => {
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const [couponData, setCouponData] = useState({
    couponName: "",
    offerName: "",
    type: "offer",
    points: "",
    expiry: "",
    percentage: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setCouponData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateCoupon = async () => {
    startLoading();
    const { couponName, expiry, type, offerName, points, percentage } =
      couponData;

    if (!couponName || !expiry || !type) {
      setTimeout(() => {
        stopLoading();
        toast.error("All Fields are required.");
      }, 800);
      return;
    }

    if (type === "offer" && !offerName) {
      setTimeout(() => {
        stopLoading();
        toast.error("Offer name is required for Offer type.");
      }, 800);
      return;
    }

    if (type === "points" && !points) {
      setTimeout(() => {
        stopLoading();
        toast.error("Points value is required for Points type.");
      }, 800);
      return;
    }

    if (type === "percentage" && !percentage) {
      setTimeout(() => {
        stopLoading();
        toast.error("Percentage value is required for Percentage type.");
      }, 800);
      return;
    }
    try {
      const baseData = {
        type: couponData.type,
        couponName: couponData.couponName,
        expiry: couponData.expiry,
      };

      let specificData = {};

      if (couponData.type === "offer") {
        specificData = { offerName: couponData.offerName };
      } else if (couponData.type === "points") {
        specificData = { points: couponData.points };
      } else if (couponData.type === "percentage") {
        specificData = { percentage: couponData.percentage };
      }

      const payload = {
        ...baseData,
        ...specificData,
      };

      const response = await createCoupon(COUPON_URLS.CREATE_COUPON, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || "Coupon created successfully.");
        router.push("/all-coupons");
      } else {
        toast.error(response.data.message || "Failed to create coupon.");
      }
    } catch (err) {
      console.error("Error creating coupon:", err);
      toast.error("Something went wrong while creating coupon.");
    } finally {
      stopLoading();
    }
  };

  const handleBack = () => {
    router.push("/all-coupons");
  };

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="ghost"
        className="w-fit top-4 flex items-center gap-2 text-[#e4bc84] hover:text-[#e4bc84]/80"
        onClick={handleBack}
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </Button>

      <form className="flex flex-col gap-6 md:gap-10">
        <div>
          <h2 className="text-xl leading-loose">Create Coupon</h2>
          <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] flex flex-col gap-5 md:gap-9 p-4 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
              <div className="flex flex-col gap-2.5">
                <Label>Coupon Type</Label>
                <select
                  value={couponData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="bg-[#0a0e11] border border-[#2e2e2e] rounded px-4 py-2 text-white"
                >
                  <option value="offer">Offer</option>
                  <option value="points">Points</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div className="flex flex-col gap-2.5">
                <Label>Coupon Name</Label>
                <Input
                  value={couponData.couponName ?? ""}
                  onChange={(e) =>
                    handleInputChange("couponName", e.target.value)
                  }
                  placeholder="Enter Name of Coupon"
                />
              </div>
            </div>

            {couponData.type === "offer" && (
              <div className="grid grid-cols-1 gap-5 md:gap-9">
                <div className="flex flex-col gap-2.5">
                  <Label>Offer Name</Label>
                  <Input
                    type="text"
                    value={couponData.offerName ?? ""}
                    onChange={(e) =>
                      handleInputChange("offerName", e.target.value)
                    }
                    placeholder="Enter offer name"
                    className="h-[100px] !bg-[#0a0e11] rounded border border-[#2e2e2e]"
                  />
                </div>
              </div>
            )}

            {couponData.type === "points" && (
              <div className="grid grid-cols-1 gap-5 md:gap-9">
                <div className="flex flex-col gap-2.5">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={couponData.points ?? ""}
                    onChange={(e) =>
                      handleInputChange("points", e.target.value)
                    }
                    placeholder="Enter points"
                  />
                </div>
              </div>
            )}

            {couponData.type === "percentage" && (
              <div className="grid grid-cols-1 gap-5 md:gap-9">
                <div className="flex flex-col gap-2.5">
                  <Label>Percentage</Label>
                  <Input
                    type="number"
                    value={couponData.percentage ?? ""}
                    onChange={(e) =>
                      handleInputChange("percentage", e.target.value)
                    }
                    placeholder="Enter percentage"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
              <div className="flex flex-col gap-2.5">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={couponData.expiry?.slice(0, 10) ?? ""}
                  onChange={(e) => handleInputChange("expiry", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCreateCoupon}
          type="button"
          className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 max-w-max px-7.5"
        >
          Create Coupon
        </Button>
      </form>
    </div>
  );
};

export default Page;
