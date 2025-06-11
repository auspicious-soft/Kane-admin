"use client";
import SingleImageUpload from "@/components/restaurants/SingleImageUpload ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

const Page = () => {
    const [currentImage, setCurrentImage] = useState<File | null>(null);
  
    const handleImageSelect = (file: File) => {
      setCurrentImage(file);
      console.log("Image selected:", file.name);
    };
  
    const handleImageRemove = () => {
      setCurrentImage(null);
      console.log("Image removed");
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
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="name" className="text-sm">
                  Stamps
                </Label>
                <Input id="name" type="text" placeholder="Stamps" required />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-sm">Description</Label>
                <Textarea className="!bg-transparent h-24" />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-sm bg-[#182226] py-4.5 px-5 rounded-lg">
                  Unlock Rewards
                </Label>
                <Textarea className="!bg-[transparent] h-24" />
              </div>
              <div className="flex flex-col gap-3">
                <Label className="text-sm bg-[#182226] py-4.5 px-5 rounded-lg">
                  Redeem In-Store
                </Label>
                <Textarea className="!bg-transparent h-24" />
              </div>
              <Button className="max-w-max px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal">
                Save
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
