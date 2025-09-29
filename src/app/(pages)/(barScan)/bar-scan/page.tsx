"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLoading } from "@/context/loading-context";
import {
  ApplyUserCoupon,
  ApplyUserOffer,
  UserDetailsWithBarCode,
} from "@/services/admin-services";
import { USER_URLS } from "@/constants/apiUrls";
import { Button } from "@/components/ui/button";
import UserOnBarScanning from "@/components/UserProfile/UserOnbarScanning";
import { Html5Qrcode } from "html5-qrcode";
import CouponDetails from "@/components/UserProfile/coupon-details";
import ScanOffersDetails from "@/components/UserProfile/scanBar-Offer-details";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "../../../../components/ui/alert-dialog";
import toast from "react-hot-toast";

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
  activePoints: number;
};

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [redemptionCurrentPage, setRedemptionCurrentPage] = useState(1);
  const [offerCurrentPage, setOfferCurrentPage] = useState(1);
  const { startLoading, stopLoading } = useLoading();
  const [type, setType] = useState<"offer" | "coupon">("coupon");
  const [scanned, setScanned] = useState<string | null>(null);
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [manualId, setManualId] = useState<string>("");
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [modalPoints, setModalPoints] = useState<number | "">("");
  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpenCoupon, setIsModalOpenCoupon] = useState(false);
  const fetchUserById = async (id: string) => {
    if (!id) return;

    try {
      setErrors(null);
      setLoading(true);
      startLoading();

      const response = await UserDetailsWithBarCode(
        USER_URLS.GET_USER_WITH_BARCODE(id)
      );

      if (!response.data.success) {
        setErrors("User not found");
        setUser(null);
        setOffers([]);
        setCoupons([]);
        toast.error("Invalid user, No user found!");
        return;
      }

      const u = response.data.data.user;
      const offersArr = Array.isArray(response.data.data.offers?.data)
        ? response.data.data.offers.data
        : [];
      const couponsArr = Array.isArray(response.data.data.coupons?.data)
        ? response.data.data.coupons.data
        : [];

      setOffers(
        offersArr.map((item: any) => ({
          id: item._id,
          offerId: item.offerId._id,
          restaurantName: item.offerId.restaurantId.restaurantName,
          offerName: item.offerId.offerName,
          type: item.type,
          date: new Date(item.createdAt).toLocaleDateString(),
          identifier: item.identifier,
        }))
      );

      setCoupons(
        couponsArr.map((item: any) => ({
          id: item._id,
          couponId: item.couponId._id,
          offerName:
            typeof item.couponId.offerName === "object" &&
            item.couponId.offerName
              ? item.couponId.offerName.offerName
              : item.couponId.couponName,
          type: item.couponId.type,
          points: item.couponId.points,
          percentage: item.couponId.percentage,
          expiry: item.couponId.expiry,
          isActive: item.couponId.isActive,
          identifier: item.identifier,
          date: new Date(item.createdAt).toLocaleDateString(),
          mainType: item.type,
          couponName: item.couponId.couponName,
        }))
      );

      setUser({
        id: u._id,
        name: u.fullName,
        phone: u.phoneNumber,
        phoneNumber: u.phoneNumber,
        email: u.email,
        fullName: u.fullName,
        countryCode: u.countryCode,
        gender: u.gender,
        points: u.totalPoints,
        status: u.isBlocked ? "Blocked" : "Active",
        profilePic: "", // handle image if needed
        loyaltyid: u.identifier,
        date: new Date(u.createdAt).toLocaleDateString(),
        reasonForBlock: u.reasonForBlock || null,
        stamps: u.stamps || "0",
        activePoints: u.activePoints || 0,
      });
    } catch (err) {
      console.error(err);
      setErrors("Failed to fetch user");
      setOffers([]);
      setCoupons([]);
      setUser(null);
      toast.error("Failed to fetch user. Try again!");
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  useEffect(() => {
    if (scannedId) fetchUserById(scannedId);
  }, [scannedId]);

  const handleOpenModal = (offer: any) => {
    setSelectedOffer(offer);
    console.log(offer, "offer");
    setIsModalOpen(true);
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setSelectedOffer(null);
    setIsModalOpen(false);
    setModalPoints("");
  };

  const handleOpenModalCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    console.log(coupon, "coupon");

    if (coupon?.type === "points") {
      setModalPoints(coupon.points);
    } else {
      setModalPoints("");
    }
    setIsModalOpenCoupon(true);
  };

  // Handler to close modal
  const handleCloseModalCoupon = () => {
    setSelectedCoupon(null);
    setIsModalOpenCoupon(false);
    setModalPoints("");
  };

  const startScanner = async () => {
    if (!scannerRef.current) return;
    const html5QrCode = new Html5Qrcode(scannerRef.current.id);

    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          setScannedId(decodedText);
          html5QrCode.stop();
        },
        (errorMessage) => {
          // Optional: you can suppress or log scan errors
          console.warn("QR Scan Error:", errorMessage);
        }
      );
    } catch (err) {
      console.error("Failed to start QR scanner:", err);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === "offer") {
      setType("offer");
      setOfferCurrentPage(1);
    } else if (value === "coupon") {
      setType("coupon");
      setRedemptionCurrentPage(1);
    }
  };

  const handleOfferUpdate = async () => {
    if (!selectedOffer || !user || modalPoints === "") return;
    const idToSend = scannedId || manualId;

    setLoading(true);
    try {
      const response = await ApplyUserOffer(`${USER_URLS.APPLY_USER_OFFER}`, {
        userId: user.id,
        offerId: selectedOffer.offerId,
        pointsWorth: modalPoints,
      });
      if (response.status === 200) {
        toast.success("Offer Applied Successfully.");
        await fetchUserById(idToSend);
      } else {
        toast.success("Offer Failed to apply..");
      }
    } catch (err) {
      console.error("Failed to apply offer:", err);
    } finally {
      setLoading(false);
    }
    handleCloseModal();
  };

  const handleCouponUpdate = async () => {
    if (!selectedCoupon || !user || modalPoints === "") return;
    const idToSend = scannedId || manualId;

    setLoading(true);
    try {
      const response = await ApplyUserCoupon(`${USER_URLS.APPLY_USER_COUPON}`, {
        userId: user.id,
        couponId: selectedCoupon.couponId,
        pointsWorth: modalPoints,
      });
      if (response.status === 200) {
        toast.success("Offer Applied Successfully.");
        await fetchUserById(idToSend);
      } else {
        toast.success("Offer Failed to apply..");
      }
    } catch (err) {
      console.error("Failed to apply offer:", err);
    } finally {
      setLoading(false);
    }
    handleCloseModal();
  };

  return (
    <>
      <div className="w-full">
        <div className="rounded border border-[#2e2e2e] px-4 py-4">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Scan User Bar-Code
          </h3>

          <div className="flex flex-col md:flex-row gap-7">
            {/* Left - Scan Box */}
            <div className="flex flex-col gap-2.5 md:hidden">
              <span className="text-white text-sm font-normal">
                Scan User ID
              </span>
              <div
                id="qr-scanner"
                ref={scannerRef}
                className="w-full h-64 bg-gray-900 rounded flex items-center justify-center cursor-pointer"
                onClick={startScanner}
              >
                {!scanned ? (
                  <span className="text-gray-500">Tap to Start QR Scanner</span>
                ) : (
                  <span className="text-green-400">Scanned: {scanned}</span>
                )}
              </div>
              <span className="text-center">OR</span>
            </div>

            {/* Right - Search User */}
            <div className="flex flex-col gap-7 flex-1">
              <div className="flex flex-col gap-2.5 w-full">
                <span className="text-white text-sm font-normal font-['MADE_Tommy_Soft']">
                  Search User ID
                </span>
                <input
                  type="text"
                  placeholder="Enter User ID"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchUserById(manualId.trim()); // 👈 Call API when Enter is pressed
                    }
                  }}
                  className="w-full h-12 bg-zinc-950 rounded border border-zinc-800 px-3 text-white focus:outline-none focus:ring-1 focus:ring-orange-300"
                />
              </div>

              <Button
                type="button"
                className="w-full sm:w-auto px-7 py-2.5 bg-orange-300 text-zinc-950 text-sm font-normal font-['MADE_Tommy_Soft'] rounded hover:bg-orange-400"
                onClick={() => fetchUserById(manualId)}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      {user && (
        <>
          <UserOnBarScanning user={user} userId={user.id} />

          <Tabs
            defaultValue="coupon"
            className="w-full"
            // onValueChange={(v) => setType(v as "offer" | "points")}
          >
            <TabsList>
              <TabsTrigger value="offer">Offers Details</TabsTrigger>
              <TabsTrigger value="coupon">Coupon Details</TabsTrigger>
            </TabsList>

            <TabsContent value="offer">
              <ScanOffersDetails
                offerHistory={offers}
                currentPage={offerCurrentPage}
                setCurrentPage={setOfferCurrentPage}
                totalItems={offers.length}
                loading={loading}
                onAction={handleOpenModal} // Pass callback
              />
            </TabsContent>

            <TabsContent value="coupon">
              <CouponDetails
                couponHistory={coupons}
                currentPage={offerCurrentPage}
                setCurrentPage={setOfferCurrentPage}
                totalItems={coupons.length}
                loading={loading}
                onAction={handleOpenModalCoupon} // Pass callback
              />
            </TabsContent>
          </Tabs>

          <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            {isModalOpen && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 50,
                  background: "rgba(10,14,17,0.6)",
                  backdropFilter: "blur(4px)",
                }}
              />
            )}
            <AlertDialogContent
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 100,
                background: "#182226",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                padding: "2rem",
                minWidth: "320px",
                maxWidth: "90vw",
                outline: "none",
              }}
              className="border-0 py-10 md:px-14 md:!max-w-[450px]"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="hide" />
                <AlertDialogDescription className="text-center text-white text-lg font-normal opacity-80">
                  Do you want to apply offer to this User?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="my-4 flex flex-col gap-2">
                <input
                  id="offer-points"
                  type="number"
                  min={0}
                  value={modalPoints}
                  onChange={(e) =>
                    setModalPoints(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  className="w-full h-10 bg-zinc-900 rounded border border-zinc-700 px-3 text-white focus:outline-none"
                  placeholder="Enter Worth points"
                />
              </div>

              <AlertDialogFooter className="!justify-center items-center mt-5">
                <AlertDialogCancel
                  className="w-full py-3 px-7 h-auto border-0 cursor-pointer !bg-[#e4bc84] rounded-lg !text-[#0a0e11] text-sm"
                  onClick={handleCloseModal}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleOfferUpdate}
                  className="w-full py-3 px-7 h-auto border-0 cursor-pointer rounded-lg !bg-[#298400] !text-white text-sm"
                >
                  Apply
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog
            open={isModalOpenCoupon}
            onOpenChange={setIsModalOpenCoupon}
          >
            {isModalOpenCoupon && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 50,
                  background: "rgba(10,14,17,0.6)",
                  backdropFilter: "blur(4px)",
                }}
              />
            )}
            <AlertDialogContent
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 100,
                background: "#182226",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                padding: "2rem",
                minWidth: "320px",
                maxWidth: "90vw",
                outline: "none",
              }}
              className="border-0 py-10 md:px-14 md:!max-w-[450px]"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="hide" />
                <AlertDialogDescription className="text-center text-white text-lg font-normal opacity-80">
                  Do you want to apply Coupon to this User?
                </AlertDialogDescription>

                <div className="my-4 flex flex-col gap-2">
                  <input
                    id="coupon-points"
                    type="number"
                    min={0}
                    value={modalPoints}
                    onChange={(e) =>
                      setModalPoints(
                        selectedCoupon?.couponId?.type === "points"
                          ? selectedCoupon.couponId.points
                          : e.target.value === ""
                          ? ""
                          : Number(e.target.value)
                      )
                    }
                    className="w-full h-10 bg-zinc-900 rounded border border-zinc-700 px-3 text-white focus:outline-none"
                    placeholder="Enter Worth points"
                    disabled={selectedCoupon?.couponId?.type === "points"}
                  />
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter className="!justify-center items-center mt-5">
                <AlertDialogCancel
                  className="w-full py-3 px-7 h-auto border-0 cursor-pointer !bg-[#e4bc84] rounded-lg !text-[#0a0e11] text-sm"
                  onClick={handleCloseModalCoupon}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCouponUpdate}
                  className="w-full py-3 px-7 h-auto border-0 cursor-pointer rounded-lg !bg-[#298400] !text-white text-sm"
                >
                  Apply
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </>
  );
}
