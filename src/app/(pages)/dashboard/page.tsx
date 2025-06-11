import React from 'react';
import { ActiveOffersIcon, PointsRedeemedIcon, TotalResturantsIcon, TotalUserIcon } from "@/lib/svg";
import TopLeaders from '@/components/dashboard/top-leaders';

const Page = () => {
    return (
      <>
         <div className="grid auto-rows-min gap-7.5 md:grid-cols-4">

        <div className="rounded bg-[#182226] border-1 border-[#2e2e2e] p-5 pb-2">
           <h3 className="justify-start text-white text-2xl font-medium  leading">1,245</h3>
           <div className="justify-start text-[#c5c5c5] text-base font-medium leading-normal">Total Users</div>
           <div className="flex gap-2 items-center justify-between w-full mt-2.5">
              <p className="justify-start text-[#c5c5c5] text-xs font-normal leading-none">+8% from last month</p>
              <div className="flex items-center justify-center w-14 h-14 bg-[#0a0e11] rounded-full border border-[#2e2e2e]">
                <TotalUserIcon /> 
              </div>
           </div>
        </div>

        <div className="rounded bg-[#182226] border-1 border-[#2e2e2e] p-5 pb-2">
           <h3 className="justify-start text-white text-2xl font-medium  leading">1,245</h3>
           <div className="justify-start text-[#c5c5c5] text-base font-medium leading-normal">Total Resturants</div>
           <div className="flex gap-2 items-center justify-between w-full mt-2.5">
              <p className="justify-start text-[#c5c5c5] text-xs font-normal leading-none">+8% from last month</p>
              <div className="flex items-center justify-center w-14 h-14 bg-[#0a0e11] rounded-full border border-[#2e2e2e]">
                <TotalResturantsIcon />
              </div>
           </div>
        </div>

        <div className="rounded bg-[#182226] border-1 border-[#2e2e2e] p-5 pb-2">
           <h3 className="justify-start text-white text-2xl font-medium  leading">1,245</h3>
           <div className="justify-start text-[#c5c5c5] text-base font-medium leading-normal">Points Redeemed This Month</div>
           <div className="flex gap-2 items-center justify-between w-full mt-2.5">
              <p className="justify-start text-[#c5c5c5] text-xs font-normal leading-none">+8% from last month</p>
              <div className="flex items-center justify-center w-14 h-14 bg-[#0a0e11] rounded-full border border-[#2e2e2e]">
                <PointsRedeemedIcon />
              </div>
           </div>
        </div>

         <div className="rounded bg-[#182226] border-1 border-[#2e2e2e] p-5 pb-2">
           <h3 className="justify-start text-white text-2xl font-medium  leading">1,245</h3>
           <div className="justify-start text-[#c5c5c5] text-base font-medium leading-normal">Active Offers</div>
           <div className="flex gap-2 items-center justify-between w-full mt-2.5">
              <p className="justify-start text-[#c5c5c5] text-xs font-normal leading-none">+8% from last month</p>
              <div className="flex items-center justify-center w-14 h-14 bg-[#0a0e11] rounded-full border border-[#2e2e2e]">
               <ActiveOffersIcon />
              </div>
           </div>
        </div>
    
      </div>
      <TopLeaders />
      </>
    );
}

export default Page;
