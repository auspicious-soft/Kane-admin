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
import { deleteRestaurant, getAllRestaurants } from "@/services/admin-services";
import { useLoading } from "@/context/loading-context";
import { RESTAURANT_URLS } from "@/constants/apiUrls";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getFilesWithMetadata, getFileWithMetadata } from "@/actions";
import CustomSelect from "../ui/Selec";

const RESTAURANTS_PER_PAGE = 12;

type Restaurant = {
  _id: number;
  id: number;
  image: string;
  name: string;
  stamps: string;
};


type SortConfig = {
  key: keyof Restaurant;
  direction: "asc" | "desc" | "none";
};

export default function RestaurantlistTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
   const [sortConfig, setSortConfig] = useState<SortConfig>({
      key: "id",
      direction: "none",
    });
  const [restaurantsPerPage, setRestaurantsPerPage] = useState<string | number>(10);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();

useEffect(() => {
  setLoading(true);
  startLoading();

  const limit =
    restaurantsPerPage === "all" ? totalRestaurants : Number(restaurantsPerPage);

  const fetchRestaurants = async () => {
    try {
      setError(null);
      const response = await getAllRestaurants(
        `${RESTAURANT_URLS.GET_ALL_RESTAURANTS(currentPage, limit)}`
      );
      const restaurants = response.data.data.restaurants;

      const imageKeys = restaurants
        .filter((restaurant: any) => restaurant.image)
        .map((restaurant: any) => restaurant.image);

      const imageUrlMap = await getFilesWithMetadata(imageKeys);

      const mappedRestaurants: Restaurant[] = restaurants.map(
        (restaurant: any, i: number) => {
          const imageUrl =
            restaurant.image && imageUrlMap[restaurant.image]?.fileUrl
              ? imageUrlMap[restaurant.image].fileUrl
              : "/images/rest-image.png";

          return {
            _id: restaurant._id,
            id:
              i +
              1 +
              (currentPage - 1) *
                (restaurantsPerPage === "all" ? 1 : Number(restaurantsPerPage)),
            name: restaurant.restaurantName,
            image: imageUrl,
            stamps: restaurant.offerCount.toString(),
          };
        }
      );

      // Sort restaurants
      const sortedRestaurants = [...mappedRestaurants].sort((a, b) => {
        if (sortConfig.direction === "none") return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }
        return 0;
      });

      setRestaurants(sortedRestaurants);
      setTotalRestaurants(response.data.data.total);
      setLoading(false);
      stopLoading();
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to load restaurants. Please try again later.");
      setLoading(false);
      stopLoading();
    }
  };

  fetchRestaurants();
}, [currentPage, restaurantsPerPage, sortConfig]);
  const totalPages = Math.ceil(
    totalRestaurants /
      (restaurantsPerPage === "all" ? totalRestaurants : Number(restaurantsPerPage))
  );

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

  const handleDelete = async (restaurantId: string) => {
    try {
      setLoading(true);
      startLoading();

      await deleteRestaurant(
        `${RESTAURANT_URLS.DELETE_RESTAURANT(restaurantId as string)}`
      );

      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter(
          (restaurant) => String(restaurant._id) !== restaurantId
        )
      );
      setTotalRestaurants((prev) => prev - 1);
      setLoading(false);
      stopLoading();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      setError("Failed to delete restaurant. Please try again later.");
      setLoading(false);
      stopLoading();
    }
  };

  const selectOptions = [
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "all", label: "All" },
  ];

  const handlerestaurantsPerPageChange = (value: string) => {
    setRestaurantsPerPage(value === "all" ? "all" : parseInt(value));
    setCurrentPage(1); // Reset to first page when changing limit
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl leading-loose">Users List</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Show</span>
          <CustomSelect
            value={restaurantsPerPage.toString()}
            onValueChange={handlerestaurantsPerPageChange}
            options={selectOptions}
            placeholder="Select"
            className="w-[100px]"
          />
        </div>
      </div>

      <div className="rounded bg-[#182226] border border-[#2e2e2e] text-[#c5c5c5] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>ID</TableHead>
              <TableHead>Restaurant Image</TableHead>
              <TableHead>Restaurant Name</TableHead>
              <TableHead>Offers</TableHead>
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
          ) : restaurants.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={8}
                  className="p-5 text-center text-sm text-gray-400"
                >
                  No Restaurants found.
                </td>
              </tr>
            </tbody>
          ) : (
            <TableBody>
              {restaurants.map((restaurant, i) => (
                <TableRow
                  key={i}
                  className={`${
                    i % 2 === 0 ? "bg-[#0A0E11]" : "bg-[#182226]"
                  } min-h-8 max-w-1`}
                >
                  <TableCell>#{restaurant.id}</TableCell>
                  <TableCell className="min-h-1 min-w-1">
                    <div className="w-[100px] h-[65px] relative ">
                      <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        fill
                        className="rounded object-fill"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{restaurant.name}</TableCell>
                  <TableCell>{restaurant.stamps}</TableCell>
                  <TableCell>
                    {/* <Link href={`/restaurants/${restaurant._id}`}> */}
                    <Button
                      onClick={() =>
                        router.push(`/restaurants/${restaurant._id}`)
                      }
                      variant="link"
                      className="text-[#e4bc84] text-xs p-0 h-auto cursor-pointer"
                    >
                      View
                    </Button>
                    {/* </Link> */}
                    <AlertDialog>
                      <AlertDialogTrigger
                        className="cursor-pointer rounded inline-flex justify-center items-center font-normal py-2.5 px-7 text-[#c5c5c5] text-xs"
                        style={{ color: "#FF0000" }}
                      >
                        Delete
                      </AlertDialogTrigger>
                      <AlertDialogContent className=" border-0 bg-[#182226] py-10 md:px-14 md:!max-w-[428px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="hide" />
                          <AlertDialogDescription className="text-center text-white text-lg font-normal opacity-80 md:!max-w-[220px] m-auto">
                            Are you sure you want to delete this restaturant?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="!justify-center items-center mt-5">
                          <AlertDialogCancel className="w-full shrink-1 py-3 px-7 h-auto border-0 cursor-pointer !bg-[#e4bc84] rounded-lg !text-[#0a0e11] text-sm">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="w-full shrink-1 py-3 px-7 h-auto border-0 cursor-pointer rounded-lg !text-white text-sm !bg-[#b40000]"
                            onClick={() => handleDelete(String(restaurant._id))}
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
      {!loading && restaurants.length > 0 && (
        <div className="flex justify-between flex-col gap-2 items-center mt-2 text-sm text-gray-400 md:flex-row">
          <div className="flex text-[#c5c5c5] text-xs font-normal">
            Showing {restaurants.length} results of {totalRestaurants}
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
