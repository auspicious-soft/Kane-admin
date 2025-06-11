import RedemptionHistory from "@/components/UserProfile/redemption-history";
import UserProfileCard from "@/components/UserProfile/UserProfileCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OffersDetails from "@/components/UserProfile/offers-details";

interface UserPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfile({ params }: UserPageProps) {
  const { id } = await params;

  const user = {
    id,
    name: parseInt(id) % 2 === 0 ? "John Doe" : "Jane Smith",
    email: "johndoe@123@gmail.com",
    phone: "+1234567890",
    loyaltyid: "4545666",
    gender: parseInt(id) % 2 === 0 ? "Male" : "Female",
    points: Math.floor(Math.random() * 1500),
    status: (parseInt(id) % 3 === 0 ? "Blocked" : "Active") as
      | "Blocked"
      | "Active",
    stamps: "98",
    date: "05/21/2025",
    blockReason:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry...",
  };

  return (
    <>
      <UserProfileCard user={user} />

      <Tabs defaultValue="redemptionHistory" className="w-full">
        <TabsList>
          <TabsTrigger value="redemptionHistory">Redemption History</TabsTrigger>
          <TabsTrigger value="0ffersdetails">Offers Details</TabsTrigger>
        </TabsList>
        <TabsContent value="redemptionHistory">
          <RedemptionHistory />
        </TabsContent>
        <TabsContent value="0ffersdetails">
          <OffersDetails />
        </TabsContent>
      </Tabs>
    </>
  );
}
