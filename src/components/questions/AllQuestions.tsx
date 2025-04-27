"use client";

import { useEffect, useState } from "react";
import {
  useQuestionsBySubjectGradePagination,
  useQuestionsCount,
} from "@/server/backend/queries/questionQueries";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import SubjectPicker from "../SubjectPicker";
import QuestionCard from "./QuestionCard";
import GradePicker from "../GradePicker";

const AllQuestions = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);

  const [subjectId, setSubjectId] = useState<string>(
    searchParams.get("subjectId") ?? ""
  );
  const [grade, setGrade] = useState<string>(searchParams.get("grade") ?? "");

  const { data: questionsCount } = useQuestionsCount({
    subjectId,
    grade,
  });
  const { data: questions, isPending } = useQuestionsBySubjectGradePagination({
    subjectId,
    grade,
    page,
  });

  const allPages =
    (questionsCount && Math.ceil(questionsCount.count / 10)) ?? 1;

  const handleNextPage = () => {
    if (questionsCount && allPages && page < allPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    if (subjectId && page) {
      queryClient.invalidateQueries({
        queryKey: ["questions-by-subject-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["questions-count"],
      });
    }
  }, [subjectId, queryClient, page]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Questions</h1>

        <div className="flex gap-4 items-center">
          <GradePicker value={grade} onChange={setGrade} />
          <SubjectPicker onChange={setSubjectId} value={subjectId} />
        </div>
      </div>

      {/* questions */}
      {isPending ? (
        <div className="flex justify-center items-center w-full mt-10">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-4 mt-10">
          {questions &&
            !_.isEmpty(questions) &&
            questions.map((question, index) => {
              return (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  subjectId={subjectId}
                  grade={grade}
                />
              );
            })}
        </div>
      )}

      {!subjectId && !isPending && (
        <div className="flex w-full mt-20">
          <div className="w-full rounded-md p-10">
            <h1 className="text-3xl font-semibold text-center text-muted-foreground">
              Please select Subject
            </h1>
          </div>
        </div>
      )}

      {_.isEmpty(questions) && !isPending && subjectId.length > 0 && (
        <div className="mt-10 flex w-full">
          <h2 className="text-3xl font-semibold text-muted-foreground mx-auto">
            {`No questions found`}
          </h2>
        </div>
      )}

      {/* pagination */}
      {!_.isEmpty(questions) && allPages > 1 && (
        <div className="mt-4 self-end">
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
                  onClick={
                    allPages && page < allPages ? handleNextPage : () => {}
                  }
                  className={cn(
                    page === allPages ? "cursor-not-allowed" : "cursor-pointer"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
export default AllQuestions;
