"use client";
import SingleImageUpload from "@/components/restaurants/SingleImageUpload ";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
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
import { useLoading } from "@/context/loading-context";
import {
  GetRestaurantById,
  updateRestaurantById,
  updateRestaurantOfferById,
} from "@/services/admin-services";
import { RESTAURANT_URLS } from "@/constants/apiUrls";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dummyImg from "../../../../../../public/images/auth-image.jpg";
import { getFileWithMetadata } from "@/actions";
import SingleImageUploadOffers from "@/components/restaurants/offerSingleImageUpload";

interface Offer {
  _id: string;
  offerName: string;
  image: string;
  description: string;
  visits: string;
  redeemInStore: string;
  unlockRewards: string;
}

interface Restaurant {
  restaurantName: string;
  logo: string;
}

const Page = () => {
  const params = useParams();
  const id = params?.id;
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [restaurantData, setRestaurantData] = useState<Restaurant>({
    restaurantName: "",
    logo: "",
  });
  const [restaurantOffersData, setRestaurantOffersData] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const [editFormData, setEditFormData] = useState({
    restaurantName: "",
    image: "",
  });
  const [editRestroOfferData, setEditRestroOfferData] = useState({
    offerName: "",
    image: "offerDummyImage2.png",
    description: "",
    visits: "",
    redeemInStore: "",
    unlockRewards: "",
  });

  const [isRestaurantImageLoading, setIsRestaurantImageLoading] =
    useState(true);
  const [isOfferImageLoading, setIsOfferImageLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRestaurantData = async () => {
      try {
        setError(null);
        startLoading();
        setLoading(true);
        setIsRestaurantImageLoading(true);
        setIsOfferImageLoading(true);
        setIsOfferImageLoading(true);
        const response = await GetRestaurantById(
          RESTAURANT_URLS.GET_SINGLE_RESTAURANT(id as string)
        );
        if (response.status === 200) {
          const restData = response.data.data.restaurant;
          const restOfferData = response.data.data.offers;
          let imageUrl = "/images/rest-image.png";
          if (restData.image) {
            try {
              const { fileUrl } = await getFileWithMetadata(restData.image);
              imageUrl = fileUrl;
            } catch (error) {
              console.error(
                `Error fetching image for restaurant ${restData._id}:`,
                error
              );
              imageUrl = "/images/rest-image.png";
            }
          }
          setRestaurantData({
            restaurantName: restData.restaurantName,
            logo: imageUrl,
          });
          const processedOffers = await Promise.all(
            restOfferData.map(async (offer: Offer) => {
              let offerImageUrl = "/images/rest-image.png";
              if (offer.image) {
                try {
                  const { fileUrl } = await getFileWithMetadata(offer.image);
                  offerImageUrl = fileUrl;
                } catch (error) {
                  console.error(
                    `Error fetching image for offer ${offer._id}:`,
                    error
                  );
                  offerImageUrl = "/images/rest-image.png";
                }
              }
              return {
                ...offer,
                image: offerImageUrl,
              };
            })
          );

          setRestaurantOffersData(processedOffers);
          setEditFormData({
            restaurantName: restData.restaurantName || "",
            image: imageUrl || "", // Store S3 key instead of URL
          });
          setEditRestroOfferData({
            offerName: "",
            image: "offerDummyImage2.png",
            description: "",
            visits: "",
            redeemInStore: "",
            unlockRewards: "",
          });
          toast.success(
            response.data.message || "Restaurant details fetched successfully"
          );
        } else {
          toast.error(response.data.message || "Failed to fetch details.");
        }
      } catch (error) {
        console.error("Error fetching restaurant:", error);
        setError("Failed to fetch restaurant data.");
        toast.error("Failed to fetch restaurant data.");
      } finally {
        setLoading(false);
        stopLoading();
        setIsRestaurantImageLoading(false);
        setIsOfferImageLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);


  const handleCardClick = (id: string) => {
    const offer = restaurantOffersData.find((offer) => offer._id === id);
    if (offer) {
      setSelectedOffer(offer);
      setIsOfferDialogOpen(true);
      setIsEditMode(false);
      setEditRestroOfferData({
        offerName: offer.offerName,
        image: offer.image,
        description: offer.description,
        visits: offer.visits,
        redeemInStore: offer.redeemInStore,
        unlockRewards: offer.unlockRewards,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditFormData({
      restaurantName: restaurantData.restaurantName,
      image: restaurantData.logo,
    });
  };

  const handleSaveEditOffer = async () => {
    if (!id || !selectedOffer?._id) return;

    setLoading(true);
    startLoading();

    try {
      const response = await updateRestaurantOfferById(
        `${RESTAURANT_URLS.UPDATE_RESTAURANT_OFFER(selectedOffer._id)}`,
        {
          ...editRestroOfferData,
          image: editRestroOfferData.image,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Offer updated successfully.");

        // Fetch the updated image URL after saving
        let updatedImageUrl = editRestroOfferData.image;
        if (editRestroOfferData.image) {
          try {
            const { fileUrl } = await getFileWithMetadata(
              editRestroOfferData.image
            );
            updatedImageUrl = fileUrl;
          } catch (error) {
            console.error(
              `Error fetching updated image for offer ${selectedOffer._id}:`,
              error
            );
            updatedImageUrl = "/images/rest-image.png";
          }
        }

        setRestaurantOffersData((prev) =>
          prev.map((offer) =>
            offer._id === selectedOffer._id
              ? {
                  ...offer,
                  ...editRestroOfferData,
                  image: updatedImageUrl,
                }
              : offer
          )
        );

        setSelectedOffer((prev) =>
          prev
            ? {
                ...prev,
                ...editRestroOfferData,
                image: updatedImageUrl,
              }
            : prev
        );

        setEditRestroOfferData({
          offerName: "",
          image: "offerDummyImage2.png",
          description: "",
          visits: "",
          redeemInStore: "",
          unlockRewards: "",
        });
        setIsEditMode(false);
        setIsOfferDialogOpen(false);
      } else {
        toast.error(
          response.data.message || "An error occurred while updating the offer."
        );
      }
    } catch (error) {
      console.error("Error updating offer:", error);
      setError("Failed to update offer. Please try again later.");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const handleImageUploaded = (key: string) => {
    setEditFormData((prev) => ({
      ...prev,
      image: key,
    }));
  };

  const handleOfferImageUploaded = (key: string) => {
    setEditRestroOfferData((prev) => ({
      ...prev,
      image: key,
    }));
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleEditSaveRestaurant = async () => {
    if (!id) return;
    setLoading(true);
    startLoading();
    setIsRestaurantImageLoading(true);
    try {
      const response = await updateRestaurantById(
        `${RESTAURANT_URLS.UPDATE_RESTAURANT(id as string)}`,
        {
          restaurantName: editFormData.restaurantName,
          image: editFormData.image,
        }
      );
      if (response.status === 200) {
        toast.success(
          response.data.message || "Restaurant Updated Successfully."
        );
        let imageUrl = "";
        if (editFormData.image) {
          try {
            const { fileUrl } = await getFileWithMetadata(editFormData.image);
            imageUrl = fileUrl;
          } catch (error) {
            console.error(
              `Error fetching image for restaurant ${editFormData.restaurantName}:`,
              error
            );
            imageUrl = "/images/rest-image.png";
          }
        }
        setRestaurantData({
          restaurantName: editFormData.restaurantName,
          logo: editFormData.image,
        });
        setEditFormData({
          restaurantName: editFormData.restaurantName,
          image: imageUrl,
        });
        setIsEditMode(false);
      } else {
        toast.error(
          response.data.message ||
            "An error occurred while updating the restaurant"
        );
      }
    } catch (error) {
      console.error("Error updating restaurants:", error);
      setError("Failed to update restaurants. Please try again later.");
    } finally {
      setLoading(false);
      stopLoading();
      setIsRestaurantImageLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOfferInputChange = (
    field: keyof typeof editRestroOfferData,
    value: string
  ) => {
    setEditRestroOfferData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] p-4 md:py-5 md:px-7 flex flex-col gap-2.5">
        <div>
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full max-w-[250px] md:min-w-[250px]">
              <div className="flex flex-col gap-3 w-[250px]">
                <Label htmlFor="name" className="text-sm">
                  Restaurant logo
                </Label>
                {isRestaurantImageLoading ? (
                  <div className="w-[250px] h-[250px] rounded-[10px] bg-gray-200 flex items-center justify-center">
                    <svg
                      className="animate-spin h-8 w-8 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                      />
                    </svg>
                  </div>
                ) : (
                  <Image
                    src={editFormData.image || "/images/rest-image.png"}
                    alt="Restaurant Logo"
                    width={250}
                    height={250}
                    className="rounded-[10px] object-cover w-[250px] h-[250px]"
                    onError={(e) => {
                      e.currentTarget.src = "/images/rest-image.png";
                    }}
                  />
                )}
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
                  value={
                    editFormData.restaurantName ||
                    restaurantData.restaurantName ||
                    ""
                  }
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
                        onImageUploaded={handleImageUploaded}
                        placeholder="Upload Restaurant Logo"
                      />
                    </div>
                    <div className="flex flex-col gap-3 max-w-[370px] m-auto w-full">
                      <Label htmlFor="name" className="text-sm">
                        Restaurant Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={editFormData.restaurantName}
                        onChange={(e) =>
                          handleInputChange("restaurantName", e.target.value)
                        }
                        placeholder="Enter restaurant name"
                      />
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="!justify-center items-center mt-5">
                    <AlertDialogCancel
                      className="py-3 px-7 h-auto cursor-pointer !bg-transparent rounded-lg !text-[#e4bc84] !border-[#E4BC84] border-1 text-sm min-w-[104px]"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="py-3 px-7 h-auto border-0 cursor-pointer rounded-lg !text-black text-sm !bg-[#E4BC84] min-w-[104px]"
                      type="button"
                      onClick={handleEditSaveRestaurant}
                    >
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
          <div
            className="px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal"
            onClick={() => router.push(`/add-new-offers?source=offer&id=${id}`)}
          >
            Add New Offers
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurantOffersData.map((offer) => (
            <div
              key={offer._id}
              onClick={() => handleCardClick(offer._id)}
              className="overflow-hidden cursor-pointer transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                {isOfferImageLoading ? (
                  <div className="w-full h-[200px] rounded bg-gray-200 flex items-center justify-center">
                    <svg
                      className="animate-spin h-8 w-8 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                      />
                    </svg>
                  </div>
                ) : (
                  <Image
                    src={offer.image || "/images/rest-image.png"}
                    alt={offer.offerName}
                    width={400}
                    height={200}
                    className="aspect-square rounded w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/images/rest-image.png";
                    }}
                  />
                )}
              </div>
              <div className="pt-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-lg line-clamp-1 transition-colors">
                    {offer.offerName}
                  </h3>
                  <p className="text-[#8B8B8B] text-sm">
                    {offer.visits} stamps required
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {restaurantOffersData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-lg mb-2">No offers available</div>
            <div className="text-gray-500 text-sm">
              Check back later for new restaurant offers
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
        <AlertDialogContent className="border-0 bg-[#182226] py-8 md:px-8 md:!max-w-[900px] overflow-auto max-h-[90vh]">
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
                        <SingleImageUploadOffers
                          onImageUploaded={handleOfferImageUploaded}
                          placeholder="Upload Offer Image"
                        />
                      ) : (
                        <Image
                          src={selectedOffer.image || "/images/rest-image.png"}
                          alt={selectedOffer.offerName}
                          width={250}
                          height={250}
                          className="rounded-lg object-cover w-[250px] h-[250px]"
                          onError={(e) => {
                            e.currentTarget.src = "/images/rest-image.png";
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 w-full">
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="offerName" className="text-sm">
                        Offer Name
                      </Label>
                      {isEditMode ? (
                        <Input
                          id="offerName"
                          type="text"
                          value={editRestroOfferData.offerName}
                          onChange={(e) =>
                            handleOfferInputChange("offerName", e.target.value)
                          }
                          required
                          name="offerName"
                        />
                      ) : (
                        <div className="px-5 py-3.5 bg-[#0a0e11] border border-[#2e2e2e] rounded-md text-[#c5c5c5] text-xs font-normal">
                          {selectedOffer.offerName}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <Label htmlFor="stamps" className="text-sm">
                        Stamps Required
                      </Label>
                      {isEditMode ? (
                        <Input
                          id="stamps"
                          type="text"
                          value={editRestroOfferData.visits}
                          onChange={(e) =>
                            handleOfferInputChange("visits", e.target.value)
                          }
                          name="visits"
                          required
                        />
                      ) : (
                        <div className="px-5 py-3.5 bg-[#0a0e11] border border-[#2e2e2e] rounded-md text-[#c5c5c5] text-xs font-normal">
                          {selectedOffer.visits} stamps
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <Label className="text-sm">Description</Label>
                      {isEditMode ? (
                        <Textarea
                          className="!bg-[#0A0E11] !text-xs"
                          value={editRestroOfferData.description}
                          onChange={(e) =>
                            handleOfferInputChange(
                              "description",
                              e.target.value
                            )
                          }
                          name="description"
                        />
                      ) : (
                        <div className="min-h-24 px-5 py-3.5 bg-[#0a0e11] border border-[#2e2e2e] rounded-md text-[#c5c5c5] text-xs font-normal">
                          {selectedOffer.description}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <Label className="text-sm">Unlock Rewards</Label>
                      {isEditMode ? (
                        <Textarea
                          className="!bg-[#0A0E11] !text-xs"
                          value={editRestroOfferData.unlockRewards}
                          onChange={(e) =>
                            handleOfferInputChange(
                              "unlockRewards",
                              e.target.value
                            )
                          }
                          name="unlockRewards"
                        />
                      ) : (
                        <div className="min-h-24 px-5 py-3.5 bg-[#0a0e11] border border-[#2e2e2e] rounded-md text-[#c5c5c5] text-xs font-normal">
                          {selectedOffer.unlockRewards}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <Label className="text-sm">Redeem In-Store</Label>
                      {isEditMode ? (
                        <Textarea
                          className="!bg-[#0A0E11] !text-xs"
                          value={editRestroOfferData.redeemInStore}
                          onChange={(e) =>
                            handleOfferInputChange(
                              "redeemInStore",
                              e.target.value
                            )
                          }
                          name="redeemInStore"
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
                  onClick={handleSaveEditOffer}
                  className="py-3 px-8 h-auto border-0 cursor-pointer rounded-lg !text-black text-sm !bg-[#E4BC84] min-w-[120px] hover:!bg-[#d4a870]"
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <AlertDialogCancel
                className="py-3 px-8 h-auto cursor-pointer !bg-transparent rounded-lg !text-[#e4bc84] !border-[#E4BC84] border-1 text-sm min-w-[120px]"
                onClick={() => setIsOfferDialogOpen(false)}
              >
                Close
              </AlertDialogCancel>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Page;
