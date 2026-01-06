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
import { getAllUsers } from "@/services/admin-services";
import { USER_URLS } from "@/constants/apiUrls";
import toast from "react-hot-toast";
import dummyImg from "../../../public/images/dummyUserPic.png";
import { getFileWithMetadata } from "@/actions";
import CustomSelect from "../ui/Selec";
import { ChevronsUpDown } from "lucide-react";


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

type SortConfig = {
  key: keyof User;
  direction: "asc" | "desc" | "none";
};

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage, setUsersPerPage] = useState<string | number>(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: "none",
  });
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

        const limit =
          usersPerPage === "all" ? totalUsers : Number(usersPerPage);
        const response = await getAllUsers(
          `${USER_URLS.GET_ALL_USERS(currentPage, limit)}`
        );
        const apiUsers = response.data.data.users;
        const mappedUsers: User[] = await Promise.all(
          apiUsers.map(async (user: any, i: number) => {
            let imageUrl =dummyImg.src;
            if (user.profilePicture && user.profilePicture !== "") {
              try {
                const { fileUrl } = await getFileWithMetadata(
                  user.profilePicture
                );
                imageUrl = fileUrl;
              } catch (error) {
                console.error(
                  `Error fetching image for user ${user._id}:`,
                  error
                );
                imageUrl = dummyImg.src;
              }
            }

            const formattedDate = user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })
            : new Date().toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              });

            return {
              _id: user._id,
              id:
                i +
                1 +
                (currentPage - 1) *
                  (usersPerPage === "all" ? 1 : Number(usersPerPage)),
              fullName: user.fullName,
              email: user.email,
              countryCode: user.countryCode,
              phoneNumber: user.phoneNumber,
              profilePic: imageUrl,
              loyaltyid: user.loyaltyid || "N/A",
              gender: user.gender || "Unknown",
              points: user.totalPoints || 0,
              status: user.isBlocked ? "Blocked" : "Active",
              stamps: user.stamps?.toString() || "0",
              date: formattedDate,
            };
          })
        );

        const sortedUsers = [...mappedUsers].sort((a, b) => {
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

        setUsers(sortedUsers);
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
  }, [currentPage, usersPerPage, sortConfig]);

  const totalPages = Math.ceil(
    totalUsers / (usersPerPage === "all" ? totalUsers : Number(usersPerPage))
  );

  const handleSort = (key: keyof User) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "none") return { key, direction: "asc" };
        if (prev.direction === "asc") return { key, direction: "desc" };
        return { key, direction: "none" };
      }
      return { key, direction: "asc" };
    });
  };

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
  const handleViewUser = useCallback(
    (userId: string) => {
      router.push(`/all-users/${userId}`);
    },
    [router]
  );

  const selectOptions = [
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "all", label: "All" },
  ];

  const handleUsersPerPageChange = (value: string) => {
    setUsersPerPage(value === "all" ? "all" : parseInt(value));
    setCurrentPage(1); // Reset to first page when changing limit
  };
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl leading-loose">Users List</h2>
       
      </div>
      <div className="rounded bg-[#182226] border border-[#2e2e2e] text-[#c5c5c5] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>
                <div className="flex items-center gap-1">ID</div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("fullName")}
                >
                  User Name
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              {/* <TableHead>
                <div
                  onClick={() => handleSort("phoneNumber")}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  Phone
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead> */}
              <TableHead>
                <div
                  onClick={() => handleSort("points")}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  Total Points
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  Status
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  onClick={() => handleSort("date")}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  Registered Date
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
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
                        <AvatarImage src={user.profilePic || dummyImg.src} />
                        {/* <AvatarFallback>CN</AvatarFallback> */}
                      </Avatar>
                      <span>{user.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  {/* <TableCell>{`${
                    user.countryCode + "-" + user.phoneNumber
                  }`}</TableCell> */}
                  <TableCell>{user.points}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.date}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      onClick={() => handleViewUser(user._id)}
                      variant="link"
                      className="text-[#e4bc84] text-xs p-0 h-auto cursor-pointer"
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
      {!loading && totalUsers > 0 && (
        <div className="flex justify-between flex-col gap-2 items-center mt-2 text-sm text-gray-400 md:flex-row">
          <div className="flex text-[#c5c5c5] text-xs font-normal">
            Showing {users.length} results of {totalUsers}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
              <div className="flex items-center gap-2 mr-2">
                <span className="text-sm text-gray-400">Show</span>
                <CustomSelect
                  value={usersPerPage.toString()}
                  onValueChange={handleUsersPerPageChange}
                  options={selectOptions}
                  placeholder="Select"
                  className="w-[100px]"
                />
              </div>
            </PaginationItem>
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
