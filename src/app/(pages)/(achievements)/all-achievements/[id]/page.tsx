"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ACHIEVEMENT_URLS, RESTAURANT_URLS } from "@/constants/apiUrls";
import { useLoading } from "@/context/loading-context";
import {
  getAchievementById,
  getAllRestaurants,
  updateAchievementById,
} from "@/services/admin-services";
import { ChevronDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


const Page = () => {
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { startLoading, stopLoading } = useLoading();
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter()
  const [achievementData, setAchievementData] = useState({
    achievementName: "",
    description: "",
    stamps: "",
    assignRestaurant: "",
    rewardValue: "",
  });
  const [editAchivementData, setEditAchivementData] = useState({
    achievementName: "",
    description: "",
    stamps: "",
    assignRestaurant: "",
    rewardValue: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchAchievementData = async () => {
      try {
        setError(null);
        startLoading();
        setLoading(true);
        const response = await getAchievementById(
          ACHIEVEMENT_URLS.GET_SINGLE_ACHIVEMENT(id as string)
        );
        if (response.status === 200) {
          const achievementD = response.data.data;
          setAchievementData(achievementD);
          setEditAchivementData({
            achievementName: achievementD.achievementName,
            description: achievementD.description,
            stamps: achievementD.stamps.toString(),
            assignRestaurant: achievementD.assignRestaurant,
            rewardValue: achievementD.rewardValue,
          });
         
        } else {
          toast.error(response.data.message || "Failed to fetch details.");
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError("Failed to fetch achievement data.");
        toast.error("Failed to fetch achievement data.");
      } finally {
        setLoading(false);
        stopLoading();
      }
    };

    fetchAchievementData();
  }, [id]);

  const fetchRestaurants = async () => {
    try {
      setError(null);
      setLoading(true);
      startLoading();

      const response = await getAllRestaurants(
        `${RESTAURANT_URLS.GET_ALL_RESTAURANTS}`
      );
      const fetchedRest = response?.data?.data;
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

  const handleSaveEditAchievement = async () => {
    if (!id) return;
    setLoading(true);
    startLoading();
    try {
      const response = await updateAchievementById(
        `${ACHIEVEMENT_URLS.UPDATE_ACHIEVEMENT(id as string)}`,
        {
          ...editAchivementData,
        }
      );
      if (response.status === 200) {
        toast.success(
          response.data.message || "Achievement Updated Successfully."
        );
        setAchievementData((prev) => ({
          ...prev,
          ...editAchivementData,
        }));
        setEditAchivementData({
          achievementName: "",
          description: "",
          stamps: "",
          assignRestaurant: "",
          rewardValue: "",
        });
      router.push("/all-achievements")
      
      } else {
        toast.error(
          response.data.message ||
            "An error occured while updating the Achievement"
        );
      }
    } catch (error) {
      console.error("Error updating Achievement:", error);
      setError("Failed to update Achievement. Please try again later.");
      setLoading(false);
      stopLoading();
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditAchivementData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form className="flex flex-col gap-6 md:gap-10">
      <div>
        <h2 className="text-xl leading-loose">Update Achievement Details</h2>
        <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] flex flex-col gap-5 md:gap-9 p-4 md:p-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
            <div className="flex flex-col gap-2.5">
              <Label> Achievement Name</Label>
              <Input
                value={editAchivementData.achievementName}
                onChange={(e) =>
                  handleInputChange("achievementName", e.target.value)
                }
                placeholder="Enter Achievement name"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label> Number of Stamps</Label>
              <Input
                value={editAchivementData.stamps}
                onChange={(e) => handleInputChange("stamps", e.target.value)}
                placeholder="Enter number of stamps"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:gap-9">
            <div className="flex flex-col gap-2.5">
              <Label> Description</Label>
              <Textarea
                value={editAchivementData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter description"
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
                value={editAchivementData.rewardValue}
                onChange={(e) =>
                  handleInputChange("rewardValue", e.target.value)
                }
                placeholder="Enter reward value"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label> Assign to Restaurants</Label>
              <div className="relative">
                <select
                  id="restaurant"
                  name="restaurant"
                  value={editAchivementData.assignRestaurant}
                  onChange={(e) =>
                    handleInputChange("assignRestaurant", e.target.value)
                  }
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-[#0a0e11] flex field-sizing-content min-h-12 w-full rounded border bg-[#0a0e11] px-5 py-3.5 text-xs shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[0px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm -webkit-appearance-none appearance-none"
                >
                  <option value="">Select a restaurant</option>
                  {restaurants.map((restaurant) => (
                    <option key={restaurant._id} value={restaurant._id}>
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
      onClick={handleSaveEditAchievement}
        type="button"
        className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 max-w-max px-7.5"
      >
        Update Achievement
      </Button>
    </form>
  );
};

export default Page;
