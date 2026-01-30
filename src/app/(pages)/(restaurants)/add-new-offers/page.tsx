"use client";
import { deleteFileFromS3 } from "@/actions";
import { useData } from "@/components/DataContext";
import SingleImageUploadOffers from "@/components/restaurants/offerSingleImageUpload";
import SingleImageUpload from "@/components/restaurants/SingleImageUpload ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RESTAURANT_URLS } from "@/constants/apiUrls";
import { useLoading } from "@/context/loading-context";
import {
  CreateRestaurant,
  CreateRestaurantOffer,
} from "@/services/admin-services";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

interface Offer {
  offerName: string;
  image: string;
  description: string;
  visits: string;
  unlockRewards: string;
  redeemInStore: string;
}

interface Errors {
  offerName?: string;
  image?: string;
  description?: string;
  visits?: string;
  unlockRewards?: string;
  redeemInStore?: string;
  general?: string;
}

const AddNewOfferContent = () => {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const id = searchParams.get("id");
  const [isUploading, setIsUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [currentImageKey, setCurrentImageKey] = useState<string | null>(null);
  const [restaurantOffers, setRestaurantOffers] = useState<Offer[]>([
    {
      offerName: "",
      image: "",
      description: "",
      visits: "",
      unlockRewards: "",
      redeemInStore: "",
    },
  ]);
  const [errors, setErrors] = useState<Errors>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const { sharedData } = useData();

  const handleImageUploaded = (key: string) => {
    setCurrentImageKey(key);
    setRestaurantOffers((prev) => [{ ...prev[0], image: key }]);
    setErrors((prev) => ({ ...prev, image: undefined }));
    console.log("Image uploaded with key:", key);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRestaurantOffers((prev) => [{ ...prev[0], [name]: value }]);
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
    const offer = restaurantOffers[0];
    if (!offer.offerName.trim()) newErrors.offerName = "Offer Name is required";
    if (!offer.image.trim()) newErrors.image = "Image is required";
    if (!offer.description.trim()) newErrors.description = "Description is required";
    if (!offer.visits.trim()) newErrors.visits = "No. of Stamps is required";
    if (!offer.unlockRewards.trim()) newErrors.unlockRewards = "Unlock Rewards value is required";
    if (!offer.redeemInStore.trim()) newErrors.redeemInStore = "Reedem in store value is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRestaurantSave = async () => {
    setFormSubmitted(true);
    if (
      !sharedData.restaurantDetails.restaurantName ||
      !sharedData.restaurantDetails.restaurantLogo
    ) {
      toast.error(
        "Restaurant name and logo are required. Please go back and fill the inputs."
      );
      return;
    }

    if (!validateForm()) {
      toast.error("All fields in the offer are required.");
      return;
    }

    setLoading(true);
    startLoading();
    try {
      setErrors({});
      const response = await CreateRestaurant(
        `${RESTAURANT_URLS.CREATE_RESTAURANTS}`,
        {
          restaurantDetails: {
            restaurantName: sharedData.restaurantDetails.restaurantName,
            image: sharedData.restaurantDetails.restaurantLogo,
          },
          restaurantOffers: restaurantOffers.map((offer) => ({
            ...offer,
            visits: parseInt(offer.visits, 10),
          })),
        }
      );

      if (response.status === 201) {
        toast.success(
          response.data.message || "Restaurant created successfully. Thank you!"
        );
        router.push("/restaurants");
      } else {
        toast.error(
          response.data.message ||
            "Error occurred while creating the restaurant."
        );
        if (restaurantOffers[0].image) {
          try {
            await deleteFileFromS3(restaurantOffers[0].image);
            setCurrentImageKey(null);
            setRestaurantOffers((prev) => [{ ...prev[0], image: "" }]);
          } catch (deleteError) {
            console.error("Failed to delete offer image:", deleteError);
          }
        }
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
      setErrors({ general: "Failed to create restaurant. Please try again later." });
      if (restaurantOffers[0].image) {
        try {
          await deleteFileFromS3(restaurantOffers[0].image);
          setCurrentImageKey(null);
          setRestaurantOffers((prev) => [{ ...prev[0], image: "" }]);
        } catch (deleteError) {
          console.error("Failed to delete offer image:", deleteError);
        }
      }
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleCreateOffer = async () => {
    setFormSubmitted(true);
    if (!id || source !== "offer") {
      toast.error("Invalid Id or source");
      stopLoading();
      return;
    }

    if (!validateForm()) {
      toast.error("All fields in the offer are required.");
      return;
    }

    setIsUploading(true);
    try {
      setErrors({});
      const response = await CreateRestaurantOffer(
        `${RESTAURANT_URLS.CREATE_RESTAURANTS_OFFER}`,
        {
          ...restaurantOffers[0],
          visits: parseInt(restaurantOffers[0].visits, 10),
          restaurantId: id,
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message || "Offer Created Successfully.");
        setRestaurantOffers([
          {
            offerName: "",
            image: "",
            description: "",
            visits: "",
            unlockRewards: "",
            redeemInStore: "",
          },
        ]);
        setCurrentImageKey(null);
        router.push(`/restaurants/${id}`);
      } else {
        toast.error(
          response.data.message || "Error occurred while creating the offer."
        );
        if (restaurantOffers[0].image) {
          try {
            await deleteFileFromS3(restaurantOffers[0].image);
            setCurrentImageKey(null);
            setRestaurantOffers((prev) => [{ ...prev[0], image: "" }]);
          } catch (deleteError) {
            console.error("Failed to delete offer image:", deleteError);
          }
        }
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      toast.error("Something went wrong");
      setErrors({ general: "Failed to create offer. Please try again later." });
      if (restaurantOffers[0].image) {
        try {
          await deleteFileFromS3(restaurantOffers[0].image);
          setCurrentImageKey(null);
          setRestaurantOffers((prev) => [{ ...prev[0], image: "" }]);
        } catch (deleteError) {
          console.error("Failed to delete offer image:", deleteError);
        }
      }
    } finally {
      setLoading(false);
      setIsUploading(false);
      stopLoading();
    }
  };

  const handleBack = () => {
    if (source === "offer" && id) {
      router.push(`/restaurants/${id}`);
    } else {
      router.push("/restaurants");
    }
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

      <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] p-4 md:px-7 flex flex-col gap-2.5">
        <h2 className="text-xl leading-loose">Offer Details</h2>
        <form>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full max-w-[330px] md:min-w-[330px]">
              <div className="flex flex-col gap-3">
                <SingleImageUploadOffers
                  onImageUploaded={handleImageUploaded}
                  placeholder="Upload Offer Logo"
                  className="rounded-[50%]"
                />
                {errors.image && (
                  <p className="text-red-500 text-xs mt-1">{errors.image}</p>
                )}
                {currentImageKey && (
                  <div className="text-xs text-gray-400 mt-2 hidden">
                    Uploaded image key: {currentImageKey}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-7 w-full">
              <div className="flex flex-col gap-3">
                <Label htmlFor="offerName" className="text-sm">
                  Offer Name
                </Label>
                <Input
                  id="offerName"
                  type="text"
                  placeholder="Offer Name"
                  required
                  value={restaurantOffers[0].offerName}
                  onChange={handleChange}
                  name="offerName"
                />
                {errors.offerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.offerName}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="visits" className="text-sm">
                  Stamps
                </Label>
                <Input
                  id="visits"
                  type="number"
                  placeholder="Stamps"
                  required
                  value={restaurantOffers[0].visits}
                  onChange={handleChange}
                  name="visits"
                />
                {errors.visits && (
                  <p className="text-red-500 text-xs mt-1">{errors.visits}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="description" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="!bg-transparent h-24"
                  value={restaurantOffers[0].description}
                  onChange={handleChange}
                  name="description"
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="unlockRewards" className="text-sm bg-[#182226] py-4.5 px-5 rounded-lg">
                  Unlock Rewards
                </Label>
                <Textarea
                  id="unlockRewards"
                  className="!bg-[transparent] h-24"
                  value={restaurantOffers[0].unlockRewards}
                  onChange={handleChange}
                  name="unlockRewards"
                />
                {errors.unlockRewards && (
                  <p className="text-red-500 text-xs mt-1">{errors.unlockRewards}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="redeemInStore" className="text-sm bg-[#182226] py-4.5 px-5 rounded-lg">
                  Redeem In-Store
                </Label>
                <Textarea
                  id="redeemInStore"
                  className="!bg-transparent h-24"
                  value={restaurantOffers[0].redeemInStore}
                  onChange={handleChange}
                  name="redeemInStore"
                />
                {errors.redeemInStore && (
                  <p className="text-red-500 text-xs mt-1">{errors.redeemInStore}</p>
                )}
              </div>
              {source === "offer" && id ? (
                <Button
                  className="max-w-max px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal"
                  type="button"
                  onClick={handleCreateOffer}
                >
                  Save Offer
                </Button>
              ) : (
                <Button
                  className="max-w-max px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal"
                  type="button"
                  onClick={handleRestaurantSave}
                  disabled={isUploading || loading}
                >
                  Save Restaurant and offer
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddNewOfferContent />
    </Suspense>
  );
};

export default Page;