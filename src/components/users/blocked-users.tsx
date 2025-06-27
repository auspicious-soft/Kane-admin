"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useLoading } from "@/context/loading-context";
import { getAllBlockedUsers } from "@/services/admin-services";
import { USER_URLS } from "@/constants/apiUrls";
import toast from "react-hot-toast";
import dummyImg from "../../../public/images/dummyUserPic.png";


const USERS_PER_PAGE = 10;

type User = {
  _id: string;
  id: number;
  fullName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  profilePic: string;
  loyaltyid: string;
  gender: string;
  points: number;
  status: string;
  stamps: string;
  date: string;
};

export default function BlockedUsers() {
 const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);
  const { startLoading, stopLoading } = useLoading();

  const router = useRouter();

useEffect(() => {
    const fetchUsers = async () => {
      try {
        setErrors(null);
        setLoading(true);
        startLoading();

        const response = await getAllBlockedUsers(
          `${USER_URLS.GET_ALL_BLOCKED_USERS(currentPage, USERS_PER_PAGE)}`
        );
        const apiUsers = response.data.data.users;
        toast.success(response.data.message || "Users fetched successfully");

        const mappedUsers: User[] = apiUsers.map((user: any, i: number) => ({
          _id: user._id,
          id: i + 1 + (currentPage - 1) * USERS_PER_PAGE,
          fullName: user.fullName,
          email: user.email,
          countryCode: user.countryCode,
          phoneNumber: user.phoneNumber,
          profilePic: user.profilePic,
          loyaltyid: user.loyaltyid || "N/A",
          gender: user.gender || "Unknown",
          points: user.points || 0,
          status: user.isBlocked ? "Blocked" : "Active",
          stamps: user.stamps?.toString() || "0",
          date: user.date || new Date().toLocaleDateString(),
        }));

        setUsers(mappedUsers);
        setTotalUsers(response.data.data.total || mappedUsers.length);
        setLoading(false);
        stopLoading();
      } catch (err) {
        console.error("Error fetching users:", err);
        setErrors("Failed to load users. Please try again later.");
        setLoading(false);
        stopLoading();
      } finally {
         setLoading(false);
        stopLoading();
      }
    };

    fetchUsers();
  }, [currentPage]);

  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  function getPagination(current: number, total: number) {
    const delta = 1;
    const range = [];
    const rangeWithDots: (number | string)[] = [];
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
const handleViewUser = useCallback((userId: string) => {
    router.push(`/blocked-users/${userId}`);
  }, [router]);
  return (
    <div className="flex flex-col gap-2.5">
      <h2 className="text-xl leading-loose">Users List</h2>
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
                  No Leaders found.
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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-4">
                        <AvatarImage src={dummyImg.src} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <span>{user.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{`${
                    user.countryCode + "-" + user.phoneNumber
                  }`}</TableCell>
                  <TableCell>{user.points}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.date}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      onClick={() => handleViewUser(user._id)}
                      variant="link"
                      className="text-[#c5c5c5] text-xs p-0 h-auto cursor-pointer"
                    >
                      View
                    </Button>
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
    </div>
  );
}
