"use client";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface Props {
  page: number;
  allPages: number;
  setPage: (page: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

const AppPagination = ({
  page,
  allPages,
  handlePreviousPage,
  handleNextPage,
  setPage,
}: Props) => {
  return (
    <Pagination>
      <PaginationContent>
        {/* previous page */}
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePreviousPage}
            className="cursor-pointer"
          />
        </PaginationItem>
        {/* 1st item */}
        <PaginationItem className={cn("cursor-pointer")}>
          <PaginationLink
            className={cn(1 === page && "dark:bg-slate-700")}
            isActive={1 === page}
            onClick={() => setPage(1)}
          >
            {1}
          </PaginationLink>
        </PaginationItem>

        {/* 2nd item */}
        <PaginationItem className={cn("cursor-pointer")}>
          <PaginationLink
            className={cn(2 === page && "dark:bg-slate-700")}
            isActive={2 === page}
            onClick={() => setPage(2)}
          >
            {2}
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        {/* last item */}
        {allPages && (
          <PaginationItem className={cn("cursor-pointer")}>
            <PaginationLink
              className={cn(allPages === page && "dark:bg-slate-700")}
              isActive={allPages === page}
              onClick={() => setPage(allPages)}
            >
              {allPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* next page */}
        <PaginationItem>
          <PaginationNext
            onClick={allPages && page < allPages ? handleNextPage : () => {}}
            className={cn(
              page === allPages ? "cursor-not-allowed" : "cursor-pointer"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
export default AppPagination;
