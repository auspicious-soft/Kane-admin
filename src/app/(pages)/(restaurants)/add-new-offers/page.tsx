"use client";
import { useData } from "@/components/DataContext";
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
import React, { useState } from "react";
import toast from "react-hot-toast";

interface Offer {
  offerName: string;
  image: string;
  description: string;
  visits: string;
  unlockRewards: string;
  redeemInStore: string;
}

const Page = () => {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const id = searchParams.get("id");
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [restaurantOffers, setRestaurantOffers] = useState<Offer[]>([
    {
      offerName: "",
      image: "dummyOfferImage.png",
      description: "",
      visits: "",
      unlockRewards: "",
      redeemInStore: "",
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const { sharedData } = useData();

  const handleImageSelect = (file: File) => {
    setCurrentImage(file);
    console.log("Image selected:", file.name);
  };

  const handleImageRemove = () => {
    setCurrentImage(null);
    console.log("Image removed");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRestaurantOffers((prev) => [{ ...prev[0], [name]: value }]);
  };

  const handleRestaurantSave = async () => {
    if (
      !sharedData.restaurantDetails.restaurantName ||
      !sharedData.restaurantDetails.restaurantLogo
    ) {
      toast.error(
        "Restaurant name and logo are required. Please go back and fill the inputs."
      );
      return;
    }

    const isAnyOfferFieldEmpty = Object.values(restaurantOffers[0]).some(
      (value) => value.trim() === ""
    );

    if (isAnyOfferFieldEmpty) {
      toast.error("All fields in the offer are required.");
      return;
    }

    setLoading(true);
    startLoading();
    try {
      setError(null);
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
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
      setError("Failed to create restaurant. Please try again later.");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleCreateOffer = async () => {
    if (!id && source !== "offer") {
      toast.error("Invalid Id and source");
      return;
    }

    const isAnyOfferFieldEmpty = Object.values(restaurantOffers[0]).some(
      (value) => value.trim() === ""
    );

    if (isAnyOfferFieldEmpty) {
      toast.error("All fields in the offer are required.");
      return;
    }
    setLoading(true);
    startLoading();
    try {
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
        router.push(`/restaurants/${id}`);
      } else {
        toast.error(
          response.data.message || "Error occured while creating the offer."
        );
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
      setError("Failed to create restaurant. Please try again later.");
      setLoading(false);
      stopLoading();
    } finally {
      setLoading(false);
      stopLoading();
    }
  };
  return (
    <>
      <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] p-4 md:py-5 md:px-7 flex flex-col gap-2.5">
        <h2 className="text-xl leading-loose">Offer Details</h2>
        <form>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full max-w-[330px] md:min-w-[330px]">
              <div className="flex flex-col gap-3">
                <SingleImageUpload
                  onImageSelect={handleImageSelect}
                  onImageRemove={handleImageRemove}
                  placeholder="Upload Restaurant Logo"
                  className="rounded-[50%]"
                />
                {currentImage && (
                  <div className="text-xs text-gray-400 mt-2 hidden">
                    Selected image: {currentImage.name}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-7 w-full">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name" className="text-sm">
                  Offer Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Offer Name"
                  required
                  value={restaurantOffers[0].offerName}
                  onChange={handleChange}
                  name="offerName"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name" className="text-sm">
                  Stamps
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Stamps"
                  required
                  value={restaurantOffers[0].visits}
                  onChange={handleChange}
                  name="visits"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-sm">Description</Label>
                <Textarea
                  className="!bg-transparent h-24"
                  value={restaurantOffers[0].description}
                  onChange={handleChange}
                  name="description"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-sm bg-[#182226] py-4.5 px-5 rounded-lg">
                  Unlock Rewards
                </Label>
                <Textarea
                  className="!bg-[transparent] h-24"
                  value={restaurantOffers[0].unlockRewards}
                  onChange={handleChange}
                  name="unlockRewards"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-sm bg-[#182226] py-4.5 px-5 rounded-lg">
                  Redeem In-Store
                </Label>
                <Textarea
                  className="!bg-transparent h-24"
                  value={restaurantOffers[0].redeemInStore}
                  onChange={handleChange}
                  name="redeemInStore"
                />
              </div>
              {source === "offer" && id ? (
                <>
                  <Button
                    className="max-w-max px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal"
                    type="button"
                    onClick={handleCreateOffer}
                  >
                    Save Offer
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="max-w-max px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal"
                    type="button"
                    onClick={handleRestaurantSave}
                  >
                    Save Restaurant and offer
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
