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

type ScanOffHistory = {
  id: string;
  restaurantName: string;
  offerName: string;
  type: "earn" | "redeem";
  date: string;
  identifier: string;
};

type ScanOffersDetailsProps = {
  offerHistory: ScanOffHistory[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
  loading: boolean;
    onAction: (offer: ScanOffHistory) => void; // Add this prop

};

export default function ScanOffersDetails({
  offerHistory,
  currentPage,
  setCurrentPage,
  totalItems,
  loading,
  onAction
}: ScanOffersDetailsProps) {
  const { startLoading, stopLoading } = useLoading();
 const [selectedOffer, setSelectedOffer] = useState<ScanOffHistory | null>(
    null
  );
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

  return (
    <div className="flex flex-col gap-2.5">
      <div className="rounded bg-[#182226] border border-[#2e2e2e] text-[#c5c5c5] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead className="tex">S.No</TableHead>
              <TableHead className="text-center">Offer Name</TableHead>
              <TableHead className="text-center">Restaurant Name</TableHead>
              <TableHead className="text-right">Status</TableHead>
                            <TableHead className="text-center">Action</TableHead>

            </TableRow>
          </TableHeader>
          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={3} // Updated colSpan to match the number of columns
                  className="p-5 text-center text-sm text-gray-400"
                >
                  Loading...
                </TableCell>
              </TableRow>
            </TableBody>
          ) : offerHistory.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={3} // Updated colSpan to match the number of columns
                  className="p-5 text-center text-sm text-gray-400"
                >
                  No Data found.
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {offerHistory.map((history, i) => (
                <TableRow
                  key={history.id}
                  className={`${i % 2 === 0 ? "bg-[#0A0E11]" : "bg-[#182226]"}`}
                >
                  <TableCell className="text">
                    <span>{(currentPage - 1) * HISTORY_PER_PAGE + i + 1}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    {history.offerName}
                  </TableCell>
                  <TableCell className="text-center">
                    {history.restaurantName}
                  </TableCell>

                  <TableCell className="text-right">
                    {history.type === "redeem"
                      ? "Used"
                      : history.type === "earn"
                      ? "Not Used"
                      : ""}
                  </TableCell>
              <TableCell className="text-center">
  <button
    className="bg-[#e4bc84] cursor-pointer rounded px-4 py-2 text-sm text-[#0a0e11]"
    onClick={() => onAction(history)}
  >
    Action
  </button>
</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      {!loading && offerHistory.length > 0 && (
        <div className="flex justify-between flex-col gap-2 items-center mt-2 text-sm text-gray-400 md:flex-row">
          <div className="flex text-[#c5c5c5] text-xs font-normal">
            Showing {offerHistory.length} results of {totalItems}
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
                    <span className="bg-white text-[#0a0e11] px-2 py-[7px] size-auto min-w-8 rounded-md inline-flex justify-center items-center text-xs font-normal transition-colors">
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