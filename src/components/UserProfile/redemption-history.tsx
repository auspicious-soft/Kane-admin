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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useLoading } from "@/context/loading-context";

const HISTORY_PER_PAGE = 10;

type RedemptHistory = {
  id: string;
  restaurantName: string;
  freeItem: string;
  points: number;
  type: "earn" | "redeem";
  date: string;
  identifier: string;
};

type RedemptionHistoryProps = {
  redemptionHistory: RedemptHistory[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
  loading: boolean;
};

export default function RedemptionHistory({
  redemptionHistory,
  currentPage,
  setCurrentPage,
  totalItems,
  loading,
}: RedemptionHistoryProps) {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [loading, startLoading, stopLoading]);

  const totalPages = Math.ceil(totalItems / HISTORY_PER_PAGE);

  function getPagination(current: number, total: number) {
    const delta = 1;
    const range = [];
    const rangeWithDots: (number | "...")[] = [];
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

  console.log(redemptionHistory,"history")

  return (
    <div className="flex flex-col gap-2.5">
      <div className="rounded bg-[#182226] border border-[#2e2e2e] text-[#c5c5c5] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead className="text-center">S.No</TableHead>
              <TableHead className="text-center">Restaurant Name</TableHead>
              <TableHead className="text-center"> Reedem Points</TableHead>
              <TableHead className="text-center">Register Date</TableHead>
            </TableRow>
          </TableHeader>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-5 text-center text-sm text-gray-400"
                >
                  Loading...
                </TableCell>
              </TableRow>
            </TableBody>
          ) : redemptionHistory.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="p-5 text-center text-sm text-gray-400"
                >
                  No Data found.
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {redemptionHistory.map((history, i) => (
                <TableRow
                  key={history.id}
                  className={`${i % 2 === 0 ? "bg-[#0A0E11]" : "bg-[#182226]"} text-center`}
                >
                  <TableCell>
                    <span>{(currentPage - 1) * HISTORY_PER_PAGE + i + 1}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span>{history.restaurantName}</span>
                  </TableCell>
                  {/* <TableCell>{history.freeItem}</TableCell> */}
                  <TableCell className="text-center">
                    {history.points}
                  </TableCell>
                  <TableCell className="text-center">{history.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      {!loading && redemptionHistory.length > 0 && (
        <div className="flex justify-between flex-col gap-2 items-center mt-2 text-sm text-gray-400 md:flex-row">
          <div className="flex text-[#c5c5c5] text-xs font-normal">
            Showing {redemptionHistory.length} results of {totalItems}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.max(1, currentPage - 1));
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
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
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