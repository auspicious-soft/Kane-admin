"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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

const USERS_PER_PAGE = 12;

type User = {
  id: number;
  restaurantImage: string;
  name: string;
  stamps: string;
};

export default function RestaurantlistTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) setLoading(true);

    const timeout = setTimeout(() => {
      const allUsers = Array.from({ length: 60 }).map((_, i) => ({
        id: i + 1,
        restaurantImage: "/images/rest-image.png",
        name: "Restaurant Name",
        stamps: "98",
      }));

      const start = (currentPage - 1) * USERS_PER_PAGE;
      const paginated = allUsers.slice(start, start + USERS_PER_PAGE);

      setUsers(paginated);
      setTotalUsers(allUsers.length);
      setLoading(false);
      setIsFirstLoad(false); // only turns false after the first fetch
    }, 100);

    return () => clearTimeout(timeout);
  }, [currentPage, isFirstLoad]);

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

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

  return (
    <>
      <div className="rounded bg-[#182226] border border-[#2e2e2e] text-[#c5c5c5] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>ID</TableHead>
              <TableHead>Restaurant Image</TableHead>
              <TableHead>Restaurant Name</TableHead>
              <TableHead>Stamps</TableHead>
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
          ) : users.length === 0 ? (
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
              {users.map((user, i) => (
                <TableRow
                  key={i}
                  className={`${i % 2 === 0 ? "bg-[#0A0E11]" : "bg-[#182226]"}`}
                >
                  <TableCell>#{user.id}</TableCell>
                  <TableCell> <Image src={user.restaurantImage} alt={user.name} width={100} height={65} className="rounded" /></TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.stamps}</TableCell>
                  <TableCell>
                    <Link href={`/restaurants/${user.id}`}>
                      <Button
                        variant="link"
                        className="text-[#c5c5c5] text-xs p-0 h-auto cursor-pointer"
                      >
                        View
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger className="cursor-pointer rounded inline-flex justify-center items-center font-normal py-2.5 px-7 text-[#c5c5c5] text-xs">
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
                          <AlertDialogAction className="w-full shrink-1 py-3 px-7 h-auto border-0 cursor-pointer rounded-lg !text-white text-sm !bg-[#b40000]">
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

      {/* Pagination - Show only if not loading AND users exist */}
      {!loading && users.length > 0 && (
        <div className="flex justify-between flex-col gap-2 items-center mt-2 text-sm text-gray-400 md:flex-row">
          <div className="flex text-[#c5c5c5] text-xs font-normal">
            Showing {users.length} results of {totalUsers}
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
