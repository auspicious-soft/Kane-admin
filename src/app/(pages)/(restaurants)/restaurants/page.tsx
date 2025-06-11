import RestaurantlistTable from "@/components/restaurants/restaurant-list-table";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl leading-loose">Resturant List</h2>
        <a href="/add-new-resturant" className="px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal">
         Add New Resturant
        </a>
      </div> 
      <RestaurantlistTable />
    </div>
  );
};

export default Page;
