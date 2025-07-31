"use client";
import SingleImageUpload from "@/components/restaurants/SingleImageUpload ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useData } from "@/components/DataContext";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { CreateRestaurant } from "@/services/admin-services";
import { RESTAURANT_URLS } from "@/constants/apiUrls";
import { useLoading } from "@/context/loading-context";
import { validateImageFile } from "@/utils/fileValidation";
import { deleteFileFromS3, generateSignedUrlForRestaurants } from "@/actions";
import { ArrowLeft } from "lucide-react";

const Page = () => {
  const [restaurantDetails, setRestaurantDetails] = useState({
    restaurantName: "",
    restaurantLogo: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { startLoading, stopLoading } = useLoading();

  const { setSharedData } = useData();
  const router = useRouter();

  const handleRedirect = () => {
    setSharedData({ restaurantDetails });
    router.push("/add-new-offers");
  };

  const handleImageUploaded = (key: string) => {
    setRestaurantDetails((prev) => ({
      ...prev,
      restaurantLogo: key,
    }));
  };

  const handleRestaurantSave = async () => {
    setLoading(true);
    startLoading();

    if (
      !restaurantDetails.restaurantName ||
      !restaurantDetails.restaurantLogo
    ) {
      setTimeout(() => {
        stopLoading();
        toast.error("Restaurant name and logo are required.");
      }, 800);
      return;
    }
    setIsUploading(true);
    try {
      setError(null);
      const response = await CreateRestaurant(
        `${RESTAURANT_URLS.CREATE_RESTAURANTS}`,
        {
          restaurantDetails: {
            restaurantName: restaurantDetails.restaurantName,
            image: restaurantDetails.restaurantLogo,
          },
        }
      );

      if (response.status === 201) {
        setRestaurantDetails({
          restaurantName: "",
          restaurantLogo: "",
        });
        toast.success(
          response.data.message || "Restaurant Created Successfully. Thank You"
        );
        router.push("/restaurants");
      } else {
        toast.error(
          response.data.message ||
            "Error occurred while creating the Restaurant"
        );

        // Cleanup uploaded image on failure
        if (restaurantDetails.restaurantLogo) {
          try {
            await deleteFileFromS3(restaurantDetails.restaurantLogo);
          } catch (deleteError) {
            console.error("Failed to delete uploaded image:", deleteError);
          }
        }
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
      toast.error("Something went wrong");
      setError("Failed to load restaurants. Please try again later.");

      // Cleanup uploaded image on failure
      if (restaurantDetails.restaurantLogo) {
        try {
          await deleteFileFromS3(restaurantDetails.restaurantLogo);
        } catch (deleteError) {
          console.error("Failed to delete uploaded image:", deleteError);
        }
      }
    } finally {
      setLoading(false);
      setIsUploading(false);
      stopLoading();
    }
  };

  const handleBack = () => {
    router.push("/restaurants"); 
  };

  return (
      <div className="flex flex-col gap-1">
       <Button
            variant="ghost"
            className="w-fit flex items-center gap-2 text-[#e4bc84] hover:text-[#e4bc84]/80"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>

      <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] p-4 md:py-5 md:px-7 flex flex-col gap-2.5">
        <h2 className="text-xl leading-loose">Restaurant Details</h2>
        <form>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full max-w-[250px] md:min-w-[250px]">
              <div className="flex flex-col gap-3">
                <Label className="text-sm">Restaurant logo</Label>
                <SingleImageUpload
                  onImageUploaded={handleImageUploaded}
                  placeholder="Upload Restaurant Logo"
                  className="rounded-[50%]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-7 w-full">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name" className="text-sm">
                  Restaurant Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Restaurant Name"
                  required
                  value={restaurantDetails.restaurantName}
                  onChange={(e) =>
                    setRestaurantDetails({
                      ...restaurantDetails,
                      restaurantName: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                className="max-w-max px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal"
                type="button"
                onClick={handleRestaurantSave}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Save"}
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] mt-6 p-4 md:py-5 md:px-7 flex flex-col gap-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <h2 className="text-xl leading-loose">Restaurant Offers</h2>
          <div
            onClick={handleRedirect}
            className="px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal cursor-pointer"
          >
            Add New Offers
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
