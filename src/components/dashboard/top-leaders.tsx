"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

import dummyImg from "../../../public/images/dummyUserPic.png";

type Leader = {
  _id: string;
  id: number;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  points: number;
  status: string;
  date: string;
};

type TopLeadersProps = {
   leaders: Leader[];
  total: number;
  currentPage: number;
   onPageChange: (page: number) => void;
};


export default function TopLeaders({
  leaders,
  total,
  currentPage,
  onPageChange,
}: TopLeadersProps) {
  // const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;
  const router = useRouter();

const paginated = leaders;

  const totalPages = Math.ceil(total / USERS_PER_PAGE);

  const getPagination = (current: number, total: number) => {
    const delta = 1;
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined = undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
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
  };

  return (
    <div className="flex flex-col gap-2.5 mt-6">
      <h2 className="text-xl leading-loose">Top Leaders</h2>
      <div className="rounded bg-[#182226] border border-[#2e2e2e] text-[#c5c5c5] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>ID</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Total Points</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="p-5 text-center text-sm text-gray-400">
                  No leaders found.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((user, i) => (
                <TableRow
                  key={user._id}
                  className={`${i % 2 === 0 ? "bg-[#0A0E11]" : "bg-[#182226]"}`}
                >
                  <TableCell>#{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-4">
                        <AvatarImage src={dummyImg.src} />
                        <AvatarFallback>
                          {user.fullName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.points}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.date}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => router.push(`/dashboard/${user._id}`)}
                      className="text-[#c5c5c5] text-xs p-0 h-auto"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {paginated.length > 0 && (
        <div className="flex justify-between flex-col gap-2 items-center mt-2 text-sm text-gray-400 md:flex-row">
          <div className="text-[#c5c5c5] text-xs font-normal">
            Showing {paginated.length} of {total} leaders
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                 <PaginationLink
        href="#"
      onClick={() => onPageChange(currentPage - 1)}
        isActive={false}
      >
        Prev
      </PaginationLink>
              </PaginationItem>

             {getPagination(currentPage, totalPages).map((page, idx) => (
  <PaginationItem key={idx}>
    {page === "..." ? (
      <span className="bg-white text-[#0a0e11] px-2 py-[7px] min-w-8 rounded-md text-xs font-normal">
        ...
      </span>
    ) : (
      <PaginationLink
        href="#"
        isActive={currentPage === Number(page)} // ✅ Fix here
        onClick={() => onPageChange(Number(page))}
      >
        {page}
      </PaginationLink>
    )}
  </PaginationItem>
))}

              <PaginationItem>
                 <PaginationLink
        href="#"
      onClick={() => onPageChange(currentPage + 1)}

        isActive={false}
      >
                  Next
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
