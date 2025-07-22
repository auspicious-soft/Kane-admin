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
import { start } from "repl";
import { ArrowLeft } from "lucide-react";

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState([]);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
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
  };
  const fetchRestaurants = async () => {
    try {
      setError(null);
      setLoading(true);
      startLoading();

      const response = await getAllRestaurants(
        `${RESTAURANT_URLS.GET_ALL_RESTAURANTS}`
      );
      const fetchedRest = response?.data?.data.restaurants;
      setRestaurants(fetchedRest);
    } catch (err) {
      console.error("Error fetching achievements:", err);
      setError("Failed to load achievements. Please try again later.");
      setLoading(false);
      stopLoading();
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAchievementSave = async () => {
    startLoading();
    setLoading(true);
    if (
      !achievementData.achievementName ||
      !achievementData.assignRestaurant ||
      !achievementData.description ||
      !achievementData.rewardValue ||
      !achievementData.stamps
    ) {
      setTimeout(() => {
        stopLoading();
        setLoading(false);
        toast.error("All Fields are required.");
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
        toast.success(
          response.data.message || "Achievement Created successfully."
        );
        router.push("/all-achievements");
      } else {
      
        toast.error(
          response.data.response.data.message ||
            "Error occured while creating the achievement"
        );
      }
    } catch (error) {
    
      toast.error(
        error.response.data.message ||
          "Error occured while creating the achievement"
      );
      setError("Failed to create achievements. Please try again later.");
      setLoading(false);
      stopLoading();
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
              <Label> Achievement Name</Label>
              <Input
                name="achievementName"
                value={achievementData.achievementName}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label> Number of Stamps</Label>
              <Input
              type="number"
                name="stamps"
                value={achievementData.stamps}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:gap-9">
            <div className="flex flex-col gap-2.5">
              <Label> Description</Label>
              <Textarea
                name="description"
                value={achievementData.description}
                onChange={handleInputChange}
                className="h-[100px] !bg-[#0a0e11] rounded border border-[#2e2e2e]"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl leading-loose">Reward Settings</h2>
        <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] flex flex-col gap-5 md:gap-9 p-4 md:p-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
            <div className="flex flex-col gap-2.5">
              <Label> Reward Value</Label>
              <Input
                name="rewardValue"
                value={achievementData.rewardValue}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label> Assign to Restaurants</Label>
              <div className="relative">
                <select
                  id="restaurant"
                  name="assignRestaurant"
                  onChange={handleInputChange}
                  value={achievementData.assignRestaurant}
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-[#0a0e11] flex field-sizing-content min-h-12 w-full rounded border bg-[#0a0e11] px-5 py-3.5 text-xs shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[0px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm -webkit-appearance-none appearance-none custom-scroll"
                  size={1}
                >
                  <option value=""  hidden>Select a restaurant</option>
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
            </div>
          </div>
        </div>
      </div>
      <Button
        type="button"
        onClick={handleAchievementSave}
        className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 max-w-max px-7.5"
      >
        Save Achievement
      </Button>
    </form>
    </div>
  );
};

export default Page;
