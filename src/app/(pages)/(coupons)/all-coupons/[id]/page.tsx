"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ACHIEVEMENT_URLS,
  COUPON_URLS,
  RESTAURANT_URLS,
} from "@/constants/apiUrls";
import { useLoading } from "@/context/loading-context";
import {
  getAchievementById,
  getAllRestaurants,
  getCouponById,
  updateAchievementById,
  updateCouponById,
} from "@/services/admin-services";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { startLoading, stopLoading } = useLoading();
  const [coupons, setCoupons] = useState([]);
  const router = useRouter();
  const [couponData, setCouponData] = useState({
    couponName: "",
    offerName: "",
    type: "",
    points: "",
    expiry: "",
    percentage: "",
  });
  const [editCouponData, setEditCouponData] = useState({
    couponName: "",
    offerName: "",
    type: "",
    points: "",
    expiry: "",
    percentage: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchCouponData = async () => {
      try {
        setError(null);
        startLoading();
        setLoading(true);
        const response = await getCouponById(
          COUPON_URLS.GET_SINGLE_COUPON(id as string)
        );
        if (response.status === 200) {
          const couponD = response.data.data;
          setCouponData(couponD);
          setEditCouponData({
            couponName: couponD.couponName,
            offerName: couponD.offerName,
            type: couponD.type,
            points: couponD.points,
            expiry: couponD.expiry,
            percentage: couponD.percentage,
          });
          toast.success(
            response.data.message || "Coupon details fetched successfully"
          );
        } else {
          toast.error(response.data.message || "Failed to fetch details.");
        }
      } catch (error) {
        console.error("Error fetching Coupon Details:", error);
        setError("Failed to fetch Coupon data.");
        toast.error("Failed to fetch coupon data.");
      } finally {
        setLoading(false);
        stopLoading();
      }
    };

    fetchCouponData();
  }, [id]);

  const handleSaveEditCoupon = async () => {
    if (!id) return;
    setLoading(true);
    startLoading();

    try {
      const baseData = {
        type: editCouponData.type,
        couponName: editCouponData.couponName,
        expiry: editCouponData.expiry,
      };

      let specificData = {};

      if (editCouponData.type === "offer") {
        specificData = { offerName: editCouponData.offerName };
      } else if (editCouponData.type === "points") {
        specificData = { points: editCouponData.points };
      } else if (editCouponData.type === "percentage") {
        specificData = { percentage: editCouponData.percentage };
      }

      const payload = {
        ...baseData,
        ...specificData,
      };

      const response = await updateCouponById(
        `${COUPON_URLS.UPDATE_COUPON(id as string)}`,
        payload
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Coupon Updated Successfully.");
        setCouponData((prev) => ({
          ...prev,
          ...editCouponData,
        }));
        setEditCouponData({
          couponName: "",
          offerName: "",
          type: "",
          points: "",
          expiry: "",
          percentage: "",
        });
        router.push("/all-coupons");
      } else {
        toast.error(response.data.message || "Error while updating Coupon");
      }
    } catch (error) {
      console.error("Error updating Coupon:", error);
      setError("Failed to update Coupon. Please try again later.");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditCouponData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
          <h2 className="text-xl leading-loose">Update Coupon Details</h2>
          <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] flex flex-col gap-5 md:gap-9 p-4 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
              <div className="flex flex-col gap-2.5">
                <Label>Coupon Type</Label>
                <select
                  disabled
                  value={editCouponData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className="bg-[#0a0e11] border border-[#2e2e2e] rounded px-4 py-2 text-white opacity-60 cursor-not-allowed"
                >
                  <option value="offer">Offer</option>
                  <option value="points">Points</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div className="flex flex-col gap-2.5">
                <Label>Coupon Name</Label>
                <Input
                  value={editCouponData.couponName ?? ""}
                  onChange={(e) =>
                    handleInputChange("couponName", e.target.value)
                  }
                  placeholder="Enter Name of Coupon"
                />
              </div>
            </div>

            {editCouponData.type === "offer" && (
              <div className="grid grid-cols-1 gap-5 md:gap-9">
                <div className="flex flex-col gap-2.5">
                  <Label>Offer Name</Label>
                  <Input
                    type="text"
                    value={editCouponData.offerName ?? ""}
                    onChange={(e) =>
                      handleInputChange("offerName", e.target.value)
                    }
                    placeholder="Enter offer name"
                    className="h-[100px] !bg-[#0a0e11] rounded border border-[#2e2e2e]"
                  />
                </div>
              </div>
            )}

            {editCouponData.type === "points" && (
              <div className="grid grid-cols-1 gap-5 md:gap-9">
                <div className="flex flex-col gap-2.5">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    value={editCouponData.points ?? ""}
                    onChange={(e) =>
                      handleInputChange("points", e.target.value)
                    }
                    placeholder="Enter points"
                  />
                </div>
              </div>
            )}

            {editCouponData.type === "percentage" && (
              <div className="grid grid-cols-1 gap-5 md:gap-9">
                <div className="flex flex-col gap-2.5">
                  <Label>Percentage</Label>
                  <Input
                    type="number"
                    value={editCouponData.percentage ?? ""}
                    onChange={(e) =>
                      handleInputChange("percentage", e.target.value)
                    }
                    placeholder="Enter Percentage"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
              <div className="flex flex-col gap-2.5">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={editCouponData.expiry?.slice(0, 10) ?? ""}
                  onChange={(e) => handleInputChange("expiry", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSaveEditCoupon}
          type="button"
          className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 max-w-max px-7.5"
        >
          Update Coupon
        </Button>
      </form>
    </div>
  );
};

export default Page;
