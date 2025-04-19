"use client";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ExamQuestionCard from "./ExamQuestionCard";
import { useMemo, useState } from "react";
import ExamTimer from "./ExamTimer";
import { Button } from "../ui/button";
import AppDialog from "../AppDialog";
import { useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import { useAnswerQuestion } from "@/server/backend/mutations/questionMutations";
import {
  useCancelUserExam,
  useCompleteExamMutation,
} from "@/server/backend/mutations/examMutations";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "../ui/separator";
import { differenceInMinutes } from "date-fns";
import { UserResponse } from "@/lib/types";
import { useExamById, useUserExam } from "@/server/backend/queries/examQueries";
import { useUserAnswers } from "@/server/backend/queries/answerQueries";
import { useTimeFrameStore } from "@/stores/useTimeFrameStore";

interface Props {
  examId: string;
  completed?: boolean;
}

const UserExam = ({ examId, completed = false }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { examStartTime } = useTimeFrameStore();

  const [userResponse, setUserResponse] = useState<UserResponse[]>([]);

  //from search params
  const userId = searchParams.get("userId") ?? "";
  const userName = searchParams.get("userName") ?? "";
  const role = searchParams.get("role") ?? "user";

  const { mutate: answerQuestion } = useAnswerQuestion();
  const { mutate: cancelUserExam } = useCancelUserExam();
  const {
    mutate: completeExamMut,
    isPending: completeExamPending,
    isSuccess: completeExamSuccess,
  } = useCompleteExamMutation();

  const { data: exam, isPending: isPendingExam } = useExamById(examId);
  const { data: userExam, isLoading: userExamLoading } = useUserExam({
    examId,
    userId,
  });

  const { data: userAnswers } = useUserAnswers({
    examId,
    userId: userId,
  });

  const examDurationMin = exam && exam.duration ? exam.duration : 0;
  const examTimerMemo = useMemo(
    () => <ExamTimer examDurationMin={examDurationMin} />,
    [examDurationMin]
  );

  const correctAnswers =
    userAnswers?.reduce((acc, answer) => {
      if (answer.questionAnswer === answer.userAnswer) return acc + 1;
      return acc;
    }, 0) ?? 0;
  const marks =
    correctAnswers && exam && exam.examQuestions
      ? (correctAnswers / exam.examQuestions.length) * 100
      : 0;

  // Complete Exam
  const completeExamTestSubmit = () => {
    queryClient.invalidateQueries({ queryKey: ["user-answers"] });
    const endTime = new Date();
    const durationMin = differenceInMinutes(endTime, examStartTime);

    completeExamMut({
      examId,
      subjectId: exam?.subjectId ?? "",
      userId: userId,
      marks: marks,
      duration: durationMin,
      completedAt: endTime.toISOString(),
      grade: exam?.grade ?? "",
    });

    // router.push(
    //   `/user/completed-exam/${examId}?userId=${userId}&userName=${userName}&role=${role}`
    // );
  };

  const answerExamQuestion = ({
    questionId,
    // questionTypeId,
    userAnswer,
    questionAnswer,
  }: UserResponse) => {
    //setting userResponse to calculate number of correct answers
    //used in completeExam marks
    const exist = userResponse.find((item) => item.questionId === questionId);
    if (exist) {
      _.forEach(userResponse, (item) => {
        if (item.questionId === exist.questionId) {
          item.userAnswer = userAnswer;
        }
      });
    } else {
      setUserResponse([
        ...userResponse,
        {
          questionId,
          // questionTypeId,
          userAnswer,
          questionAnswer,
        },
      ]);
    }

    answerQuestion({
      examId,
      userId: userId,
      questionId,
      // questionTypeId,
      userAnswer,
      questionAnswer,
      // subjectId: exam?.subjectId ?? "",
    });
  };

  const cancelExam = () => {
    cancelUserExam({
      examId,
      userId: userId,
    });
    router.back();
  };

  if (isPendingExam) {
    return (
      <div className="flex w-full mt-10 justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (_.isEmpty(exam)) {
    return (
      <div className="flex w-full mt-10 justify-center items-center">
        <h2 className="text-3xl text-muted-foreground font-semibold">
          No Exam Found
        </h2>
      </div>
    );
  }

  if (completeExamPending) {
    return (
      <div className="flex w-full mt-10 justify-center items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin" />
        <h2 className="text-3xl text-muted-foreground font-semibold">
          Please wait, Checking Answers.....!
        </h2>
      </div>
    );
  }

  if (completeExamSuccess) {
    router.push(
      `/user/completed-exam/${examId}?userId=${userId}&userName=${userName}&role=${role}`
    );
  }

  return (
    <div className="flex flex-col gap-8 relative">
      <div className="fixed self-end z-50">{!completed && examTimerMemo}</div>

      <div className="flex flex-col gap-4">
        <Card className="flex flex-col justify-start dark:border-primary/40 dark:bg-transparent">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between items-center relative">
                <div className="text-2xl font-bold flex gap-2">
                  <span className="uppercase">{exam?.name} Exam,</span>
                  <span>{role === "admin" && userName}</span>
                  <span>{completed && "Answer Sheet"}</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-4 flex flex-col h-full">
            {exam && exam.examQuestions.length ? (
              exam.examQuestions.map((item, index) => {
                const userAnswer = userAnswers?.find(
                  (answer) => answer.questionId === item.questionId
                );
                return (
                  <ExamQuestionCard
                    key={index}
                    index={index}
                    question={item.questions}
                    questionNumber={index + 1}
                    examId={examId}
                    role={role}
                    answer={userAnswer}
                    answerExamQuestion={answerExamQuestion}
                    completed={completed}
                  />
                );
              })
            ) : (
              <div className="flex items-center justify-center mt-10">
                <h1 className="text-xl font-bold text-muted-foreground">
                  No Questions Found!
                </h1>
              </div>
            )}

            <div className="mt-8 flex gap-4 self-end print:hidden">
              {/* cancel exam */}
              {!completed && (
                <AppDialog
                  trigger={<Button variant="outline">Cancel</Button>}
                  body={
                    <p className="font-semibold text-lg">
                      Are you sure you want to{" "}
                      <span className="font-bold text-red-500">Cancel</span>{" "}
                      this Exam
                    </p>
                  }
                  title="Cancel Exam"
                  okDialog={cancelExam}
                />
              )}

              {/* finish exam */}
              {!completed && (
                <AppDialog
                  trigger={<Button>Complete Exam</Button>}
                  body={
                    <p className="font-semibold text-lg">
                      Are you sure you want to Finish this Exam
                    </p>
                  }
                  title="Complete Exam"
                  okDialog={completeExamTestSubmit}
                />
              )}

              {completed && (
                <Button onClick={() => router.push("/")}>Back</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* result */}
        {userExam?.marks && (
          <div>
            {userExamLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <div className="top-8 right-8 absolute">
                {completed && !_.isEmpty(exam?.examQuestions) && (
                  <div className="flex flex-col top-8 right-8 absolute z-10 text-red-600 -rotate-[25deg]">
                    <p className="font-bold text-7xl font-marks">
                      {userExam?.marks}
                    </p>
                    <Separator className="font-marks h-2 bg-red-600" />
                    <p className="font-bold text-7xl font-marks">100</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default UserExam;
