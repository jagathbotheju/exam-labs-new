"use client";

import { useState } from "react";
import { UserExt } from "@/server/db/schema/users";
import { Loader2 } from "lucide-react";
import { useSubjects } from "@/server/backend/queries/subjectQueries";
import {
  useIncorrectQuestions,
  useIncorrectQuestionsCount,
} from "@/server/backend/queries/questionQueries";
import _ from "lodash";
import QuestionCard from "./QuestionCard";
import SubjectPicker from "../SubjectPicker";
import UserPicker from "../UserPicker";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { cn } from "@/lib/utils";
import GradePicker from "../GradePicker";

const IncorrectQuestions = () => {
  const [page, setPage] = useState(1);
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const [selectedUser, setSelectedUser] = useState<UserExt>();
  const [grade, setGrade] = useState<string>(
    selectedUser && selectedUser.grade ? selectedUser.grade : ""
  );

  const { data: subjects } = useSubjects();
  const subject = subjects?.find((subject) => subject.id === subjectId);
  const { data: incorrectQuestions, isPending } = useIncorrectQuestions({
    userId: selectedUser?.id,
    subjectId,
    page,
    grade,
  });
  console.log("incorrectQuestions", incorrectQuestions);

  const { data: questionsCount } = useIncorrectQuestionsCount({
    subjectId: subjectId as string,
    grade,
    userId: selectedUser?.id as string,
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

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold">Incorrect Questions</h1>

          <div className="flex gap-4 items-center">
            <SubjectPicker
              onChange={setSubjectId}
              value={subjectId as string}
            />
            <GradePicker value={grade} onChange={setGrade} />
            <UserPicker onChange={setSelectedUser} user={selectedUser} />
          </div>
        </div>

        {/* incorrect questions */}
        {isPending ? (
          <div className="flex justify-center items-center w-full mt-10">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col w-full gap-4 mt-10">
            {incorrectQuestions &&
              !_.isEmpty(subject) &&
              grade.length &&
              !_.isEmpty(incorrectQuestions) &&
              incorrectQuestions.map((question, index) => {
                return (
                  <QuestionCard
                    key={index}
                    question={question.questions}
                    index={page + index}
                    subjectId={subject.id}
                    userId={selectedUser?.id}
                    grade={question.grade as string}
                    term={question.questions.term}
                  />
                );
              })}
          </div>
        )}
      </div>

      {!selectedUser ? (
        <div className="flex w-full mt-20">
          <div className="w-full rounded-md p-10">
            <h1 className="text-3xl font-semibold text-center text-muted-foreground">
              Please select Student
            </h1>
          </div>
        </div>
      ) : !grade.length ? (
        <div className="flex w-full mt-20">
          <div className="w-full rounded-md p-10">
            <h1 className="text-3xl font-semibold text-center text-muted-foreground">
              Please select Grade
            </h1>
          </div>
        </div>
      ) : !subjectId ? (
        <div className="flex w-full mt-20">
          <div className="w-full rounded-md p-10">
            <h1 className="text-3xl font-semibold text-center text-muted-foreground">
              Please select Subject
            </h1>
          </div>
        </div>
      ) : (
        !isPending && (
          <div className="flex justify-center items-center w-full mt-10">
            <h1 className="text-3xl font-semibold text-muted-foreground">
              No Questions Found
            </h1>
          </div>
        )
      )}

      {/* pagination */}
      {!_.isEmpty(incorrectQuestions) && allPages > 1 && (
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
export default IncorrectQuestions;
