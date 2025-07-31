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

interface Errors {
  couponName?: string;
  type?: string;
  expiry?: string;
  offerName?: string;
  points?: string;
  percentage?: string;
}

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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleInputChange = (field: string, value: string) => {
    setCouponData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for the field in real-time when user types
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    } else if (formSubmitted) {
      // Show error if form was submitted and field is empty
      setErrors((prev) => ({
        ...prev,
        [field]:
          field === "type"
            ? "Please select a coupon type"
            : "This field is required",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!couponData.couponName.trim())
      newErrors.couponName = "Coupon Name is required";
    if (!couponData.type.trim()) newErrors.type = "Please select a coupon type";

    if (couponData.type === "offer" && !couponData.offerName.trim())
      newErrors.offerName = "Offer Name is required";
    if (
      couponData.type === "points" &&
      (!couponData.points.trim() || Number(couponData.points) <= 0)
    )
      newErrors.points = "Points must be a positive number";
    if (couponData.expiry && new Date(couponData.expiry) < new Date())
      newErrors.expiry = "Expiry date must be in the future";
    if (couponData.type === "percentage" && !couponData.percentage.trim())
      newErrors.percentage = "Percentage is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCoupon = async () => {
    setFormSubmitted(true);
    if (!validateForm()) {
      setTimeout(() => {
        toast.error("All required fields must be filled.");
      }, 800);
      return;
    }

    try {
      startLoading();
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
        setCouponData({
          couponName: "",
          offerName: "",
          type: "offer",
          points: "",
          expiry: "",
          percentage: "",
        });
        setErrors({});
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
                <Label htmlFor="type">Coupon Type</Label>
                <select
                  id="type"
                  value={couponData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="bg-[#0a0e11] border border-[#2e2e2e] rounded px-4 py-2 text-white"
                >
                  <option value="offer">Offer</option>
                  <option value="points">Points</option>
                  <option value="percentage">Percentage</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                <Label htmlFor="couponName">Coupon Name</Label>
                <Input
                  id="couponName"
                  value={couponData.couponName ?? ""}
                  onChange={(e) =>
                    handleInputChange("couponName", e.target.value)
                  }
                  placeholder="Enter Name of Coupon"
                />
                {errors.couponName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.couponName}
                  </p>
                )}
              </div>
            </div>

            {couponData.type === "offer" && (
              <div className="grid grid-cols-1 gap-5 md:gap-9">
                <div className="flex flex-col gap-2.5">
                  <Label htmlFor="offerName">Offer Name</Label>
                  <Input
                    id="offerName"
                    type="text"
                    value={couponData.offerName ?? ""}
                    onChange={(e) =>
                      handleInputChange("offerName", e.target.value)
                    }
                    placeholder="Enter offer name"
                    className="h-[100px] !bg-[#0a0e11] rounded border border-[#2e2e2e]"
                  />
                  {errors.offerName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.offerName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {couponData.type === "points" && (
              <div className="grid grid-cols-1 gap-5 md:gap-9">
                <div className="flex flex-col gap-2.5">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={couponData.points ?? ""}
                    onChange={(e) =>
                      handleInputChange("points", e.target.value)
                    }
                    placeholder="Enter points"
                  />
                  {errors.points && (
                    <p className="text-red-500 text-xs mt-1">{errors.points}</p>
                  )}
                </div>
              </div>
            )}

            {couponData.type === "percentage" && (
              <div className="grid grid-cols-1 gap-5 md:gap-9">
                <div className="flex flex-col gap-2.5">
                  <Label htmlFor="percentage">Percentage</Label>
                  <Input
                    id="percentage"
                    type="number"
                    value={couponData.percentage ?? ""}
                    onChange={(e) =>
                      handleInputChange("percentage", e.target.value)
                    }
                    placeholder="Enter percentage"
                  />
                  {errors.percentage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.percentage}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  type="date"
                  value={couponData.expiry?.slice(0, 10) ?? ""}
                  onChange={(e) => handleInputChange("expiry", e.target.value)}
                />
                {errors.expiry && (
                  <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
                )}
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
