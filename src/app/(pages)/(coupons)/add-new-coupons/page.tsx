"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COUPON_URLS, RESTAURANT_URLS } from "@/constants/apiUrls";
import { useLoading } from "@/context/loading-context";
import {
  createCoupon,
  getAllRestaurants,
  GetRestaurantById,
} from "@/services/admin-services";
import React, { useEffect, useRef, useState } from "react";
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
    restaurantId?: string;

}
type Restaurant = {
  _id: string;
  restaurantName: string;
};

interface Offer {
  _id: string;
  offerName: string;
  image: string;
  description: string;
  visits: string;
  redeemInStore: string;
  unlockRewards: string;
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
    restaurantId: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantOffersData, setRestaurantOffersData] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
const expiryRef = useRef<HTMLInputElement | null>(null);

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
    if (!couponData.expiry)
      newErrors.expiry = "Expiry date is required and must be in the future ";
    if (couponData.type === "percentage" && !couponData.percentage.trim())
      newErrors.percentage = "Percentage is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const response = await getAllRestaurants(
          RESTAURANT_URLS.GET_ALL_RESTAURANTS(1, 1000) // get first 50
        );
        setRestaurants(response.data.data.restaurants);
      } catch (err) {
        toast.error("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (!couponData.restaurantId) return;

    const fetchRestaurantData = async () => {
      try {
        startLoading();
        const response = await GetRestaurantById(
          RESTAURANT_URLS.GET_SINGLE_RESTAURANT(couponData.restaurantId)
        );
        if (response.status === 200) {
          setRestaurantOffersData(response.data.data.offers);
        } else {
          toast.error(response.data.message || "Failed to fetch offers");
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
        toast.error("Failed to fetch restaurant offers");
      } finally {
        stopLoading();
      }
    };

    fetchRestaurantData();
  }, [couponData.restaurantId]);

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
      specificData = { 
        restaurantId: couponData.restaurantId, // send restaurantId
        offerName: couponData.offerName,        // send offerId instead of offerName
      };
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
        restaurantId: "",
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
                  className="bg-[#0a0e11] border border-[#2e2e2e] rounded px-4 py-2 text-white text-xs"
                >
                  <option className="text-xs" value="offer">Offer</option>
                  <option className="text-xs" value="points">Points</option>
                  <option className="text-xs" value="percentage">Percentage</option>
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
                  placeholder="Enter Name of Coupon "
                />
                {errors.couponName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.couponName}
                  </p>
                )}
              </div>
            </div>
 {couponData.type === "offer" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
               <div className="flex flex-col gap-2.5">
              <Label htmlFor="restaurant">Select Restaurant</Label>
              <select
                id="restaurant"
                value={couponData.restaurantId}
                onChange={(e) =>
                  handleInputChange("restaurantId", e.target.value)
                }
                className="bg-[#0a0e11] border border-[#2e2e2e] rounded px-4 py-2 text-white text-xs"
              >
                <option  className="text-xs" value="">Select Restaurant</option>
                {restaurants.map((rest) => (
                  <option key={rest._id}  className="text-xs" value={rest._id}>
                    {rest.restaurantName}
                  </option>
                ))}
              </select>
              {errors.restaurantId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.restaurantId}
                </p>
              )}
            </div>

            {/* Offers Dropdown */}
            {couponData.type === "offer" && (
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="offer">Select Offer</Label>
                <select
                  id="offer"
                  value={couponData.offerName}
                  onChange={(e) => handleInputChange("offerName", e.target.value)}
                  className="bg-[#0a0e11] border border-[#2e2e2e] rounded px-4 py-2 text-white text-xs"
                >
                  <option  className="text-xs" value="">Select Offer</option>
                  {restaurantOffersData.map((offer) => (
                    <option key={offer._id}  className="text-xs" value={offer._id}>
                      {offer.offerName}
                    </option>
                  ))}
                </select>
                {errors.offerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.offerName}</p>
                )}
              </div>
            )}
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
    ref={expiryRef}
    id="expiry"
    type="date"
    value={couponData.expiry?.slice(0, 10) ?? ""}
    min={getTodayDate()}
    onChange={(e) => handleInputChange("expiry", e.target.value)}
    onClick={() => expiryRef.current?.showPicker()}
    onFocus={() => expiryRef.current?.showPicker()}
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
