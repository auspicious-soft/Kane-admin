import AchievementListTable from "@/components/achievements/achievement-list-table";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl leading-loose">Achievement List</h2>
        <a href="/add-new-achievements" className="px-[30px] py-2.5 bg-[#e4bc84] rounded inline-flex justify-center items-center gap-2 text-[#0a0e11] text-sm font-normal">
         Add New Achievement
        </a>
      </div> 
      <AchievementListTable />
    </div>
  );
};

export default Page;
