"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import Image from "next/image";
import {
  deleteAchivementById,
  deleteRestaurant,
  getAllRestaurants,
} from "@/services/admin-services";
import { useLoading } from "@/context/loading-context";
import { ACHIEVEMENT_URLS, RESTAURANT_URLS } from "@/constants/apiUrls";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const RESTAURANTS_PER_PAGE = 12;
const ACHIEVEMENTS_PER_PAGE = 12;

type Restaurant = {
  _id: number;
  id: number;
  restaurantImage: string;
  name: string;
  stamps: string;
};

type Achievement = {
  sNo: number;
  id: number;
  _id: number;
  achievementName: string;
  restaurantName: string;
  rewardValue: string;
  numberOfStamps: string;
};

export default function AchievementListTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const { startLoading, stopLoading } = useLoading();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  //   const [totalAchivements, setTotalAchievements]= useState(0);
  const router = useRouter();

  useEffect(() => {
    const generatedAchievements: Achievement[] = [];

    for (let i = 1; i <= 10; i++) {
      generatedAchievements.push({
        sNo: i,
        id: i,
        _id: i,
        achievementName: `Achievement ${i}`,
        restaurantName: `Restaurant ${i}`,
        rewardValue: `${i * 10} points`,
        numberOfStamps: `${i}`,
      });
    }

    setAchievements(generatedAchievements);
  }, []);

  console.log(achievements, "achieveve");

  const totalAchivements = achievements.length;

  const totalPages = Math.ceil(totalAchivements / ACHIEVEMENTS_PER_PAGE);

  function getPagination(current: number, total: number) {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l: number | undefined = undefined;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      startLoading();
      await deleteAchivementById(
        `${ACHIEVEMENT_URLS.DELETE_ACHIEVEMENT(id as string)}`
      );
      setLoading(false);
      stopLoading();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      setError("Failed to delete restaurant. Please try again later.");
      setLoading(false);
      stopLoading();
    }
  };
  return (
    <>
      <div className="rounded bg-[#182226] border border-[#2e2e2e] text-[#c5c5c5] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>S.No</TableHead>
              <TableHead>Achievement Name</TableHead>
              <TableHead>Restaurant Name</TableHead>
              <TableHead>Reward value</TableHead>
              <TableHead>Number of Stamps</TableHead>
              <TableHead className="w-36">Action</TableHead>
            </TableRow>
          </TableHeader>
          {loading ? (
            <tbody>
              <tr>
                <td
                  colSpan={8}
                  className="p-5 text-center text-sm text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            </tbody>
          ) : achievements.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={8}
                  className="p-5 text-center text-sm text-gray-400"
                >
                  No Achievements found.
                </td>
              </tr>
            </tbody>
          ) : (
            <TableBody>
              {achievements.map((achievement, i) => (
                <TableRow
                  key={i}
                  className={`${i % 2 === 0 ? "bg-[#0A0E11]" : "bg-[#182226]"}`}
                >
                  <TableCell>#{achievement.id}</TableCell>
                  <TableCell>{achievement.achievementName}</TableCell>
                  <TableCell>{achievement.restaurantName}</TableCell>
                  <TableCell>{achievement.rewardValue}</TableCell>

                  <TableCell>{achievement.numberOfStamps}</TableCell>
                  <TableCell>
                    {/* <Link href={`/restaurants/${restaurant._id}`}> */}
                    <Button
                      onClick={() =>
                        router.push(`/all-achievements/${achievement._id}`)
                      }
                      variant="link"
                      className="text-[#c5c5c5] text-xs p-0 h-auto cursor-pointer"
                    >
                      View
                    </Button>
                    {/* </Link> */}
                    <AlertDialog>
                      <AlertDialogTrigger className="cursor-pointer rounded inline-flex justify-center items-center font-normal py-2.5 px-7 text-[#c5c5c5] text-xs">
                        Delete
                      </AlertDialogTrigger>
                      <AlertDialogContent className=" border-0 bg-[#182226] py-10 md:px-14 md:!max-w-[428px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="hide" />
                          <AlertDialogDescription className="text-center text-white text-lg font-normal opacity-80 md:!max-w-[220px] m-auto">
                            Are you sure you want to delete this Achievement?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="!justify-center items-center mt-5">
                          <AlertDialogCancel className="w-full shrink-1 py-3 px-7 h-auto border-0 cursor-pointer !bg-[#e4bc84] rounded-lg !text-[#0a0e11] text-sm">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="w-full shrink-1 py-3 px-7 h-auto border-0 cursor-pointer rounded-lg !text-white text-sm !bg-[#b40000]"
                            onClick={() => console.log("Deleted")}
                          >
                            Yes, Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Pagination - Show only if not loading AND Restaurants exist */}
      {!loading && achievements.length > 0 && (
        <div className="flex justify-between flex-col gap-2 items-center mt-2 text-sm text-gray-400 md:flex-row">
          <div className="flex text-[#c5c5c5] text-xs font-normal">
            Showing {achievements.length} results of {totalAchivements}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                  }}
                  isActive={false}
                >
                  Prev
                </PaginationLink>
              </PaginationItem>

              {getPagination(currentPage, totalPages).map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === "..." ? (
                    <span className="bg-white text-[#0a0e11] px-2 py-[7px] size-auto min-w-8 rounded-md inline-flex flex-col justify-center items-center gap-2.5 text-xs font-normal transition-colors">
                      ...
                    </span>
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(Number(page));
                      }}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  }}
                  isActive={false}
                >
                  Next
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
