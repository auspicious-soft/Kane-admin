import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown } from "lucide-react";
import React from "react";
const restaurants = [
  { id: 1, name: "Starbucks" },
  { id: 2, name: "Domino's Pizza" },
  { id: 3, name: "KFC" },
  { id: 4, name: "McDonald's" },
];

const Page = () => {
  return (
    <form className="flex flex-col gap-6 md:gap-10">
      <div>
        <h2 className="text-xl leading-loose">Update Achievement Details</h2>
        <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] flex flex-col gap-5 md:gap-9 p-4 md:p-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
            <div className="flex flex-col gap-2.5">
              <Label> Achievement Name</Label>
              <Input />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label> Number of Stamps</Label>
              <Input />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:gap-9">
            <div className="flex flex-col gap-2.5">
              <Label> Description</Label>
              <Textarea className="h-[100px] !bg-[#0a0e11] rounded border border-[#2e2e2e]" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl leading-loose">Reward Settings</h2>
        <div className="bg-[#0a0e11] rounded border border-[#2e2e2e] flex flex-col gap-5 md:gap-9 p-4 md:p-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-9">
            <div className="flex flex-col gap-2.5">
              <Label> Reward Value</Label>
              <Input />
            </div>
            <div className="flex flex-col gap-2.5">
              <Label> Assign to Restaurants</Label>
               <div className="relative">
              <select
                id="restaurant"
                name="restaurant"
                className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-[#0a0e11] flex field-sizing-content min-h-12 w-full rounded border bg-[#0a0e11] px-5 py-3.5 text-xs shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[0px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm -webkit-appearance-none appearance-none"
              >
                <option value="">Select a restaurant</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-[14px] top-[14px] pointer-events-none"><ChevronDown /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full text-sm !bg-[#E4BC84] rounded min-h-12.5 max-w-max px-7.5"
      >
        Update Achievement
      </Button>
    </form>
  );
};

export default Page;
