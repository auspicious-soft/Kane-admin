"use client";

import React, { useEffect, useState } from "react";
import {
  ActiveOffersIcon,
  PointsRedeemedIcon,
  TotalResturantsIcon,
  TotalUserIcon,
} from "@/lib/svg";
import TopLeaders from "@/components/dashboard/top-leaders";
import toast from "react-hot-toast";
import { getDashboardData } from "@/services/admin-services";
import { DASHBOARD_URL } from "@/constants/apiUrls";
import { useLoading } from "@/context/loading-context";

const USERS_PER_PAGE = 10;

const Page = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
    const { startLoading, stopLoading } = useLoading();

  const fetchDashboard = async (page: number) => {
  setLoading(true);
    startLoading();
    try {
      const response = await getDashboardData(
        DASHBOARD_URL.GET_DASHBOARD_DATA(page, USERS_PER_PAGE)
      );

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        toast.error("Failed to fetch dashboard data.");
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      toast.error("Something went wrong.");
    } finally {
     setLoading(false);
        stopLoading();
    }
  };

  useEffect(() => {
    fetchDashboard(currentPage);
  }, [currentPage]);

  if (!dashboardData || loading) {
    return <p className="text-white">Loading...</p>;
  }

  const {
    totalUsers,
    totalPointsRedeemed,
    totalRestaurants,
    totalRestaurantsOffers,
    topLeaders = [],
    total = 0,
    page = 1,
  } = dashboardData;

  const formattedLeaders = topLeaders.map((user: any, i: number) => ({
    _id: user._id,
    id: (page - 1) * USERS_PER_PAGE + (i + 1),
    fullName: user.fullName,
    email: user.email,
    phone: `${user.countryCode}-${user.phoneNumber}`,
    gender: user.gender || "Unknown",
    points: user.totalPoints || 0,
    status: user.isBlocked ? "Blocked" : "Active",
    date: new Date(user.createdAt).toLocaleDateString("en-GB"),
  }));

  return (
    <>
      <div className="grid auto-rows-min gap-7.5 md:grid-cols-4">
        {/* Stats Cards */}
        <div className="rounded bg-[#182226] border-1 border-[#2e2e2e] p-5 pb-2">
          <h3 className="text-white text-2xl font-medium">{totalUsers}</h3>
          <div className="text-[#c5c5c5] text-base font-medium">Total Users</div>
          <div className="flex justify-between items-center mt-2.5">
            <p className="text-[#c5c5c5] text-xs">+8% from last month</p>
            <div className="flex items-center justify-center w-14 h-14 bg-[#0a0e11] rounded-full border border-[#2e2e2e]">
              <TotalUserIcon />
            </div>
          </div>
        </div>

        {/* Repeat for other cards */}
        <div className="rounded bg-[#182226] border-1 border-[#2e2e2e] p-5 pb-2">
          <h3 className="text-white text-2xl font-medium">{totalRestaurants}</h3>
          <div className="text-[#c5c5c5] text-base font-medium">Total Restaurants</div>
          <div className="flex justify-between items-center mt-2.5">
            <p className="text-[#c5c5c5] text-xs">+8% from last month</p>
            <div className="flex items-center justify-center w-14 h-14 bg-[#0a0e11] rounded-full border border-[#2e2e2e]">
              <TotalResturantsIcon />
            </div>
          </div>
        </div>

        <div className="rounded bg-[#182226] border-1 border-[#2e2e2e] p-5 pb-2">
          <h3 className="text-white text-2xl font-medium">{totalPointsRedeemed}</h3>
          <div className="text-[#c5c5c5] text-base font-medium">Points Redeemed</div>
          <div className="flex justify-between items-center mt-2.5">
            <p className="text-[#c5c5c5] text-xs">+8% from last month</p>
            <div className="flex items-center justify-center w-14 h-14 bg-[#0a0e11] rounded-full border border-[#2e2e2e]">
              <PointsRedeemedIcon />
            </div>
          </div>
        </div>

        <div className="rounded bg-[#182226] border-1 border-[#2e2e2e] p-5 pb-2">
          <h3 className="text-white text-2xl font-medium">{totalRestaurantsOffers}</h3>
          <div className="text-[#c5c5c5] text-base font-medium">Active Offers</div>
          <div className="flex justify-between items-center mt-2.5">
            <p className="text-[#c5c5c5] text-xs">+8% from last month</p>
            <div className="flex items-center justify-center w-14 h-14 bg-[#0a0e11] rounded-full border border-[#2e2e2e]">
              <ActiveOffersIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Top Leaders Table */}
      <TopLeaders
        leaders={formattedLeaders}
        total={total}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default Page;
