"use client";
import RedemptionHistory from "@/components/UserProfile/redemption-history";
import UserProfileCard from "@/components/UserProfile/UserProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OffersDetails from "@/components/UserProfile/offers-details";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/loading-context";
import { useParams, useRouter } from "next/navigation";
import { USER_URLS } from "@/constants/apiUrls";
import {
  getUserById,
  getUserOfferAndRedemptionHistory,
} from "@/services/admin-services";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const HISTORY_PER_PAGE = 10;

type User = {
  id: string;
  name: string;
  phone: string;
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  profilePic: string;
  loyaltyid: string;
  gender: string;
  points: number;
  status: "Active" | "Blocked";
  stamps: string;
  date: string;
  reasonForBlock: string;
    totalStampsCollected:number;

};

type RedemptHistory = {
  type: "earn" | "redeem";
  id: string;
  restaurantName: string;
  freeItem: string;
  points: number;
  date: string;
  identifier: string;
};

type OffHistory = {
  id: string;
  restaurantName: string;
  offerName: string;
  type: "earn" | "redeem";
    earnedAt:string;
  redeemedAt:string;
  date: string;
  identifier: string;
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redemptionCurrentPage, setRedemptionCurrentPage] = useState(1);
  const [offerCurrentPage, setOfferCurrentPage] = useState(1);
  const { startLoading, stopLoading } = useLoading();
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptHistory[]>(
    []
  );
  const [offerHistory, setOfferHistory] = useState<OffHistory[]>([]);
  const [type, setType] = useState<"offer" | "points">("points");
  const [redemptionTotalItems, setRedemptionTotalItems] = useState(0);
  const [offerTotalItems, setOfferTotalItems] = useState(0);

  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setErrors(null);
        setLoading(true);
        startLoading();
        const response = await getUserById(
          `${USER_URLS.GET_SINGLE_USER(id as string)}`
        );
        const userDetails = response.data.data;

        const mappedUser: User = {
          id: userDetails._id,
          name: userDetails.fullName,
          phone: userDetails.phoneNumber,
          fullName: userDetails.fullName,
          email: userDetails.email,
          countryCode: userDetails.countryCode,
          reasonForBlock: userDetails.reasonForBlock
            ? userDetails.reasonForBlock
            : null,
          phoneNumber: userDetails.phoneNumber,
          profilePic: "",
          loyaltyid: userDetails.identifier,
          gender: userDetails.gender,
          points: userDetails.totalPoints,
          status: userDetails.isBlocked ? "Blocked" : "Active",
          stamps: userDetails.stamps || "0",
          totalStampsCollected:userDetails.totalStampsCollected || 0,
          date: userDetails.createdAt
            ? new Date(userDetails.createdAt).toLocaleDateString()
            : "",
        };

        setUser(mappedUser);
      } catch (error) {
        console.error(error);
        setErrors("Failed to fetch user details.");
      } finally {
        setLoading(false);
        stopLoading();
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id]);

  const handleTabChange = (value: string) => {
    if (value === "offer") {
      setType("offer");
      setOfferCurrentPage(1);
    } else if (value === "points") {
      setType("points");
      setRedemptionCurrentPage(1);
    }
  };

  useEffect(() => {
    const fetchRedemptionHistory = async () => {
      try {
        setLoading(true);
        startLoading();
        const currentPage =
          type === "offer" ? offerCurrentPage : redemptionCurrentPage;
        const response = await getUserOfferAndRedemptionHistory(
          USER_URLS.GET_USER_OFFER_AND_REDEMPTION_HISTORY(
            currentPage,
            HISTORY_PER_PAGE,
            id as string,
            type
          )
        );
        const historyData = response.data.data.history;

        if (type === "offer") {
          const mappedOfferHistory: OffHistory[] = historyData.map(
            (item: any) => ({
              id: item._id,
              restaurantName: item.offerId.restaurantId.restaurantName,
              offerName: item.offerId.offerName,
              type: item.type as "earn" | "redeem",
              date: new Date(item.createdAt).toLocaleDateString(),
              identifier: item.identifier,
               earnedAt:item.earnedAt ?  new Date(item.earnedAt).toLocaleDateString() : "-",
 redeemedAt: item.redeemedAt ?  new Date(item.redeemedAt).toLocaleDateString() : "-"
            })
          );
          setOfferHistory(mappedOfferHistory);
          setOfferTotalItems(response.data.data.pagination.total);
        } else {
          const mappedRedemptionHistory: RedemptHistory[] = historyData.map(
            (item: any) => ({
              id: item._id,
              restaurantName: item.restaurantId.restaurantName,
              freeItem: item.orderDetails,
              points: item.points,
              type: item.type,
              date: new Date(item.createdAt).toLocaleDateString(),
              identifier: item.identifier,
            })
          );
          setRedemptionHistory(mappedRedemptionHistory);
          setRedemptionTotalItems(response.data.data.pagination.total);
        }
      } catch (error) {
        console.error(error);
        setErrors("Failed to fetch history.");
      } finally {
        setLoading(false);
        stopLoading();
      }
    };

    if (id) {
      fetchRedemptionHistory();
    }
  }, [id, redemptionCurrentPage, offerCurrentPage, type]);

  const handleBack = () => {
    router.push("/blocked-users");
  };
  return (
    <>

      <Button
        variant="ghost"
        className="w-fit flex items-center gap-2 text-[#e4bc84] hover:text-[#e4bc84]/80"
        onClick={handleBack}
      >
        <ArrowLeft className="h-5 w-5" />
        Back
      </Button>
      <UserProfileCard user={user} userId={id} />

      <Tabs
        defaultValue="points"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="points">Redemption History</TabsTrigger>
          <TabsTrigger value="offer">Offers Details</TabsTrigger>
        </TabsList>
        <TabsContent value="points">
          <RedemptionHistory
            redemptionHistory={redemptionHistory}
            currentPage={redemptionCurrentPage}
            setCurrentPage={setRedemptionCurrentPage}
            totalItems={redemptionTotalItems}
            loading={loading}
          />
        </TabsContent>
        <TabsContent value="offer">
          <OffersDetails
            offerHistory={offerHistory}
            currentPage={offerCurrentPage}
            setCurrentPage={setOfferCurrentPage}
            totalItems={offerTotalItems}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
