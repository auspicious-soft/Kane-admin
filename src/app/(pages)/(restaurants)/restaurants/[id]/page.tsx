"use client";
import SingleImageUpload from "@/components/restaurants/SingleImageUpload ";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Sample restaurant data
const restaurantOffers = [
  {
    id: 1,
    title: "Get free coffee",
    image: "/images/auth-image.jpg",
    stamps: "10",
    description: "Get a free pizza when you buy any large pizza. Valid until end of month.",
    discount: "50% OFF",
    restaurant: "Pizza Palace",
    unlockRewards: "Collect 10 stamps to unlock this amazing offer. Visit our restaurant and make a purchase to earn stamps.",
    redeemInStore: "Show this offer to our staff at the counter to redeem your free coffee. Valid for dine-in and takeaway."
  },
    {
    id: 2,
    title: "Get free coffee",
    image: "/images/auth-image.jpg",
    stamps: "10",
    description: "Get a free pizza when you buy any large pizza. Valid until end of month.",
    discount: "50% OFF",
    restaurant: "Pizza Palace",
    unlockRewards: "Collect 10 stamps to unlock this amazing offer. Visit our restaurant and make a purchase to earn stamps.",
    redeemInStore: "Show this offer to our staff at the counter to redeem your free coffee. Valid for dine-in and takeaway."
  },
    {
    id: 3,
    title: "Get free coffee",
    image: "/images/auth-image.jpg",
    stamps: "10",
    description: "Get a free pizza when you buy any large pizza. Valid until end of month.",
    discount: "50% OFF",
    restaurant: "Pizza Palace",
    unlockRewards: "Collect 10 stamps to unlock this amazing offer. Visit our restaurant and make a purchase to earn stamps.",
    redeemInStore: "Show this offer to our staff at the counter to redeem your free coffee. Valid for dine-in and takeaway."
  },
    {
    id: 4,
    title: "Get free coffee",
    image: "/images/auth-image.jpg",
    stamps: "10",
    description: "Get a free pizza when you buy any large pizza. Valid until end of month.",
    discount: "50% OFF",
    restaurant: "Pizza Palace",
    unlockRewards: "Collect 10 stamps to unlock this amazing offer. Visit our restaurant and make a purchase to earn stamps.",
    redeemInStore: "Show this offer to our staff at the counter to redeem your free coffee. Valid for dine-in and takeaway."
  },
];

const Page = () => {
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<typeof restaurantOffers[0] | null>(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form states for editing
  const [editFormData, setEditFormData] = useState({
    title: "",
    stamps: "",
    description: "",
    unlockRewards: "",
    redeemInStore: ""
  });

  const handleImageSelect = (file: File) => {
    setCurrentImage(file);
    console.log("Image selected:", file.name);
  };

  const handleImageRemove = () => {
    setCurrentImage(null);
    console.log("Image removed");
  };

  const handleCardClick = (offerId: number) => {
    const offer = restaurantOffers.find(offer => offer.id === offerId);
    if (offer) {
      setSelectedOffer(offer);
      setIsOfferDialogOpen(true);
      setIsEditMode(false); // Reset to view mode
      // Initialize form data with current offer data
      setEditFormData({
        title: offer.title,
        stamps: offer.stamps,
        description: offer.description,
        unlockRewards: offer.unlockRewards,
        redeemInStore: offer.redeemInStore
      });
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    // Reset form data to original values
    if (selectedOffer) {
      setEditFormData({
        title: selectedOffer.title,
        stamps: selectedOffer.stamps,
        description: selectedOffer.description,
        unlockRewards: selectedOffer.unlockRewards,
        redeemInStore: selectedOffer.redeemInStore
      });
    }
    setCurrentImage(null);
  };

  const handleSaveEdit = () => {
    // Here you would typically update the data in your database/state
    console.log("Saving edited data:", editFormData);
    console.log("New image:", currentImage);
    
    // For demo purposes, we'll just exit edit mode
    setIsEditMode(false);
    setCurrentImage(null);
    
    // You could update the selectedOffer here with new data
    // setSelectedOffer({...selectedOffer, ...editFormData});
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] p-4 md:py-5 md:px-7  flex flex-col gap-2.5">
        <div>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full max-w-[250px] md:min-w-[250px]">
              <div className="flex flex-col gap-3 w-[250px] ">
                <Label htmlFor="name" className="text-sm">
                  Restaurant logo
                </Label>
                <Image
                  src="/images/auth-image.jpg"
                  alt="Restaurant Logo"
                  width={250}
                  height={250}
                  className="rounded-[10px] object-cover  w-[250px] h-[250px]"
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
                  value="Starbucks"
                  readOnly
                  required
                />
              </div>
              <AlertDialog>
                <AlertDialogTrigger className="cursor-pointer max-w-max px-[30px] py-2.5 bg-transparent rounded inline-flex justify-center items-center gap-2 text-[#E4BC84] text-sm font-normal !border-[#E4BC84] border-1">
                  Edit
                </AlertDialogTrigger>
                <AlertDialogContent className="border-0 bg-[#182226] py-10 md:px-14 md:!max-w-[652px] overflow-auto max-h-[90vh]">
                  <AlertDialogHeader className="flex flex-col gap-5">
                    <AlertDialogTitle className="hidden" />
                    <h2 className="justify-start text-white text-xl leading-loose text-center">
                      Edit Restaurant Details
                    </h2>
                    <div className="flex flex-col gap-3 max-w-[250px] w-full m-auto">
                      <SingleImageUpload
                        onImageSelect={handleImageSelect}
                        onImageRemove={handleImageRemove}
                        placeholder="Upload Restaurant Logo"
                      />
                      {currentImage && (
                        <div className="text-xs text-gray-400 mt-2 hidden">
                          Selected image: {currentImage.name}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-3  max-w-[370px] m-auto w-full">
                      <Label htmlFor="name" className="text-sm">
                        Restaurant Name
                      </Label>
                      <Input id="name" type="text" placeholder="Starbucks" />
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="!justify-center items-center mt-5">
                    <AlertDialogCancel className=" py-3 px-7 h-auto cursor-pointer !bg-transparent rounded-lg !text-[#e4bc84] !border-[#E4BC84] border-1 text-sm min-w-[104px]">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction className="py-3 px-7 h-auto border-0 cursor-pointer rounded-lg !text-black text-sm !bg-[#E4BC84] min-w-[104px]">
                      Save
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] p-4 md:py-5 md:px-7 flex flex-col gap-2.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <h2 className="text-xl leading-loose">Restaurant Offers</h2>
          <a
            href="/add-new-offers"
            className="px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal"
          >
            Add New Offers
          </a>
        </div>
        
        {/* Restaurant Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantOffers.map((offer) => (
            <div
              key={offer.id}
              onClick={() => handleCardClick(offer.id)}
              className="overflow-hidden cursor-pointer transition-all duration-300 group"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  width={400}
                  height={200}
                  className=" aspect-square rounded w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to placeholder if image doesn't exist
                    e.currentTarget.src = "/images/auth-image.jpg";
                  }}
                />
              </div>
              
              {/* Content */}
              <div className="pt-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-lg line-clamp-1 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-[#8B8B8B] text-sm ">
                    {offer.stamps} stamps required
                  </p>
                </div>
              
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {restaurantOffers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-lg mb-2">No offers available</div>
            <div className="text-gray-500 text-sm">Check back later for new restaurant offers</div>
          </div>
        )}
      </div>

      {/* Restaurant Offer Detail Dialog */}
      <AlertDialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <AlertDialogContent className="border-0 bg-[#182226] py-8 md:px-8 md:!max-w-[900px] overflow-auto max-h-[90vh] ">
          <AlertDialogHeader className="flex flex-col gap-5 text-left">
            <AlertDialogTitle className="hidden" />
            {selectedOffer && (
              <>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl leading-loose">Edit Offer Detail</h2>
                  {!isEditMode && (
                    <Button 
                      onClick={handleEditClick}
                      className="max-w-max px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal hover:bg-[#d4a870]"
                    >
                      Edit
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-10">
                  <div className="w-full max-w-[250px] md:min-w-[250px]">
                    <div className="flex flex-col gap-3">
                      {isEditMode ? (
                        <SingleImageUpload
                          onImageSelect={handleImageSelect}
                          onImageRemove={handleImageRemove}
                          placeholder="Upload Offer Image"
                        />
                      ) : (
                        <Image
                          src={selectedOffer.image}
                          alt={selectedOffer.title}
                          width={250}
                          height={250}
                          className="rounded-lg object-cover w-[250px] h-[250px]"
                        />
                      )}
                      {currentImage && isEditMode && (
                        <div className="text-xs text-gray-400 mt-2">
                          Selected image: {currentImage.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 w-full">
                    {/* Offer Name */}
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="offerName" className="text-sm">
                        Offer Name
                      </Label>
                      {isEditMode ? (
                        <Input
                          id="offerName"
                          type="text"
                          value={editFormData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          required
                        />
                      ) : (
                        <div className="px-5 py-3.5 bg-[#0a0e11] border border-[#2e2e2e] rounded-md text-[#c5c5c5] text-xs font-normal">
                          {selectedOffer.title}
                        </div>
                      )}
                    </div>

                    {/* Stamps */}
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="stamps" className="text-sm">
                        Stamps Required
                      </Label>
                      {isEditMode ? (
                        <Input
                          id="stamps"
                          type="text"
                          value={editFormData.stamps}
                          onChange={(e) => handleInputChange('stamps', e.target.value)}
                          required
                        />
                      ) : (
                        <div className="px-5 py-3.5 bg-[#0a0e11] border border-[#2e2e2e] rounded-md text-[#c5c5c5] text-xs font-normal">
                          {selectedOffer.stamps} stamps
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-3">
                      <Label className="text-sm">Description</Label>
                      {isEditMode ? (
                        <Textarea
                          className="!bg-[#0A0E11] !text-xs"
                          value={editFormData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                      ) : (
                        <div className="min-h-24 px-5 py-3.5 bg-[#0a0e11] border border-[#2e2e2e] rounded-md text-[#c5c5c5] text-xs font-normal">
                          {selectedOffer.description}
                        </div>
                      )}
                    </div>

                    {/* Unlock Rewards */}
                    <div className="flex flex-col gap-3">
                      <Label className="text-sm">
                        Unlock Rewards
                      </Label>
                      {isEditMode ? (
                        <Textarea
                          className="!bg-[#0A0E11]  !text-xs"
                          value={editFormData.unlockRewards}
                          onChange={(e) => handleInputChange('unlockRewards', e.target.value)}
                        />
                      ) : (
                        <div className="min-h-24 px-5 py-3.5 bg-[#0a0e11] border border-[#2e2e2e] rounded-md text-[#c5c5c5] text-xs font-normal">
                          {selectedOffer.unlockRewards}
                        </div>
                      )}
                    </div>

                    {/* Redeem In-Store */}
                    <div className="flex flex-col gap-3">
                      <Label className="text-sm ">
                        Redeem In-Store
                      </Label>
                      {isEditMode ? (
                        <Textarea
                          className="!bg-[#0A0E11] !text-xs"
                          value={editFormData.redeemInStore}
                          onChange={(e) => handleInputChange('redeemInStore', e.target.value)}
                        />
                      ) : (
                        <div className="min-h-24 px-5 py-3.5 bg-[#0a0e11] border border-[#2e2e2e] rounded-md text-[#c5c5c5] text-xs font-normal">
                          {selectedOffer.redeemInStore}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </AlertDialogHeader>
          
          <AlertDialogFooter className="!justify-center items-center mt-6 gap-3">
            {isEditMode ? (
              <>
                <AlertDialogCancel 
                  className="py-3 px-8 h-auto cursor-pointer !bg-transparent rounded-lg !text-[#e4bc84] !border-[#E4BC84] border-1 text-sm min-w-[120px]"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  onClick={handleSaveEdit}
                  className="py-3 px-8 h-auto border-0 cursor-pointer rounded-lg !text-black text-sm !bg-[#E4BC84] min-w-[120px] hover:!bg-[#d4a870]"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <AlertDialogCancel 
                  className="py-3 px-8 h-auto cursor-pointer !bg-transparent rounded-lg !text-[#e4bc84] !border-[#E4BC84] border-1 text-sm min-w-[120px]"
                  onClick={() => setIsOfferDialogOpen(false)}
                >
                  Close
                </AlertDialogCancel>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Page;