"use client";
import { useExamById } from "@/server/backend/queries/examQueries";
import { Loader2 } from "lucide-react";
import _ from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import { User, UserExt } from "@/server/db/schema/users";
import UserPicker from "../UserPicker";
import { useUsers } from "@/server/backend/queries/userQueries";
import ExamQuestionCard from "./ExamQuestionCard";
import { useAddExamToUser } from "@/server/backend/mutations/examMutations";

interface Props {
  examId: string;
  user: User;
}

const ExamDetails = ({ examId, user }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<UserExt | undefined>();

  const { data: exam, isLoading: isLoadingExam } = useExamById(examId);
  const { data: allUsers } = useUsers();
  const { mutate: addExamToUser } = useAddExamToUser();

  const examUserIds = exam?.userExams.map((exam) => exam?.userId);
  const examUsers = _.filter(allUsers, (item) =>
    _.includes(examUserIds, item.id)
  );

  const assignExamToUser = () => {
    if (!selectedUser) return toast.error("Please select a userAnswers");
    if (selectedUser && examId) {
      addExamToUser({
        userId: selectedUser.id,
        examId,
      });
    }
  };

  useEffect(() => {
    if (examId) {
      queryClient.invalidateQueries({ queryKey: ["exam-by-id"] });
    }
  }, [examId, queryClient]);

  if (isLoadingExam) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="flex flex-col dark:bg-transparent dark:border-primary/40">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="uppercase text-2xl font-bold">
            <span>{exam?.name}</span>, Exam Details
          </div>
          {exam && exam.examQuestions && (
            <div className="flex items-center gap-2">
              <p>Assign Exam to Student</p>
              <UserPicker user={selectedUser} onChange={setSelectedUser} />
              <Button disabled={!selectedUser} onClick={assignExamToUser}>
                Assign
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col h-full">
        {/* students having this exam */}
        <div className="flex gap-4">
          {examUsers.map((item) => (
            <Badge key={item.id}>{item.name}</Badge>
          ))}
        </div>

        {exam && exam.examQuestions.length ? (
          exam.examQuestions.map((item, index) => {
            return (
              <ExamQuestionCard
                key={index}
                question={item.questions}
                questionNumber={index + 1}
                examId={examId}
                role={user?.role ?? "user"}
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

        <Button className="w-fit self-end" onClick={() => router.back()}>
          Back
        </Button>
      </CardContent>
    </Card>
  );
};
export default ExamDetails;
