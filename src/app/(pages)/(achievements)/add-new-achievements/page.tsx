"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ACHIEVEMENT_URLS, RESTAURANT_URLS } from "@/constants/apiUrls";
import { useLoading } from "@/context/loading-context";
import {
  createAchievement,
  getAllRestaurants,
} from "@/services/admin-services";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

interface Errors {
  achievementName?: string;
  description?: string;
  stamps?: string;
  assignRestaurant?: string;
  rewardValue?: string;
}

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState([]);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const { startLoading, stopLoading } = useLoading();
  const [achievementData, setAchievementData] = useState({
    achievementName: "",
    description: "",
    stamps: "",
    assignRestaurant: "",
    rewardValue: "",
  });
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setAchievementData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field in real-time when user types
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } else if (formSubmitted) {
      // Show error if form was submitted and field is empty
      setErrors((prev) => ({ ...prev, [name]: "This field is required" }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!achievementData.achievementName.trim())
      newErrors.achievementName = "Achievement Name is required";
    if (!achievementData.description.trim())
      newErrors.description = "Achievement Description is required";
    if (!achievementData.stamps.trim())
      newErrors.stamps = "No. of Stamps is required";
    if (!achievementData.assignRestaurant.trim())
      newErrors.assignRestaurant = "Selection of Restaurant is Required";
    if (!achievementData.rewardValue.trim())
      newErrors.rewardValue = "Reward Value is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchRestaurants = async () => {
    try {
      setError(null);
      setLoading(true);
      startLoading();

      const response = await getAllRestaurants(
        `${RESTAURANT_URLS.GET_ALL_RESTAURANTS(1, 2000)}`
      );
      const fetchedRest = response.data.data.restaurants;
      setRestaurants(fetchedRest);
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to load restaurants. Please try again later.");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAchievementSave = async () => {
    setFormSubmitted(true);
    if (!validateForm()) {
      setTimeout(() => {
        toast.error("All fields are required.");
      }, 800);
      return;
    }

    try {
      setError(null);
      setLoading(true);
      startLoading();

      const response = await createAchievement(
        `${ACHIEVEMENT_URLS.CREATE_ACHIVEMENT}`,
        {
          ...achievementData,
        }
      );
      if (response.status === 201) {
        setAchievementData({
          achievementName: "",
          description: "",
          stamps: "",
          assignRestaurant: "",
          rewardValue: "",
        });
        setErrors({});
        toast.success(
          response.data.message || "Achievement created successfully."
        );
        router.push("/all-achievements");
      } else {
        toast.error(
          response.data.response?.data?.message ||
            "Error occurred while creating the achievement"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error occurred while creating the achievement"
      );
      setError("Failed to create achievement. Please try again later.");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleBack = () => {
    router.push("/all-achievements");
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
          <h2 className="text-xl leading-loose">Achievement Details</h2>
          <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] flex flex-col gap-5 md:gap-9 p-4 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="achievementName">Achievement Name</Label>
                <Input
                  id="achievementName"
                  name="achievementName"
                  value={achievementData.achievementName}
                  onChange={handleInputChange}
                />
                {errors.achievementName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.achievementName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="stamps">Number of Stamps</Label>
                <Input
                  id="stamps"
                  type="number"
                  name="stamps"
                  value={achievementData.stamps}
                  onChange={handleInputChange}
                />
                {errors.stamps && (
                  <p className="text-red-500 text-xs mt-1">{errors.stamps}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 md:gap-9">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={achievementData.description}
                  onChange={handleInputChange}
                  className="h-[100px] !bg-[#0a0e11] rounded border border-[#2e2e2e]"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl leading-loose">Reward Settings</h2>
          <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] flex flex-col gap-5 md:gap-9 p-4 md:p-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="rewardValue">Reward Value</Label>
                <Input
                  id="rewardValue"
                  name="rewardValue"
                  value={achievementData.rewardValue}
                  onChange={handleInputChange}
                />
                {errors.rewardValue && (
                  <p className="text-red-500 text-xs mt-1">{errors.rewardValue}</p>
                )}
              </div>
              <div className="flex flex-col gap-2.5">
                <Label htmlFor="assignRestaurant">Assign to Restaurants</Label>
                <div className="relative">
                  <select
                    id="assignRestaurant"
                    name="assignRestaurant"
                    onChange={handleInputChange}
                    value={achievementData.assignRestaurant}
                    className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-[#0a0e11] flex field-sizing-content min-h-12 w-full rounded border bg-[#0a0e11] px-5 py-3.5 text-xs shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[0px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm -webkit-appearance-none appearance-none custom-scroll"
                    size={1}
                  >
                    <option value="" hidden>
                      Select a restaurant
                    </option>
                    {restaurants.map((restaurant) => (
                      <option
                        key={restaurant._id}
                        value={restaurant._id}
                        className="bg-[#1a1a1a] text-white"
                      >
                        {restaurant.restaurantName}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-[14px] top-[14px] pointer-events-none">
                    <ChevronDown />
                  </span>
                </div>
                {errors.assignRestaurant && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.assignRestaurant}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button
          type="button"
          onClick={handleAchievementSave}
          className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 max-w-max px-7.5"
          disabled={loading}
        >
          Save Achievement
        </Button>
      </form>
    </div>
  );
};

export default Page;