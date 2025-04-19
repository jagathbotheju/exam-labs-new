"use client";
import { QuestionExt } from "@/server/db/schema/questions";
import { Card, CardContent } from "../ui/card";
import {
  CircleX,
  FilePenLine,
  FilePlus,
  ImageIcon,
  Trash2,
} from "lucide-react";
import {
  useAddQuestionToExam,
  useDeleteQuestion,
  useRemoveQuestionFromExam,
} from "@/server/backend/mutations/questionMutations";
import parse from "html-react-parser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { ExamExt } from "@/server/db/schema/exams";
import _ from "lodash";
import { useUsers } from "@/server/backend/queries/userQueries";
import ExamPicker from "../ExamPicker";
import { useExams } from "@/server/backend/queries/examQueries";

interface Props {
  question: QuestionExt;
  index: number;
  subjectId: string;
  userId?: string;
  grade: string;
}

const QuestionCard = ({ question, index, subjectId, userId, grade }: Props) => {
  const router = useRouter();
  const [exam, setExam] = useState<ExamExt | undefined>();
  const [questionExams, setQuestionExams] = useState<ExamExt[] | undefined>();

  const { data: users } = useUsers();
  const user = users?.find((user) => user.id === userId);

  const { mutate: deleteQuestion } = useDeleteQuestion();
  const { mutate: removeQuestionFromExam } = useRemoveQuestionFromExam();
  const { mutate: addQuestion } = useAddQuestionToExam();
  const { data: exams } = useExams();

  const addQuestionToExam = () => {
    if (exam && question.id) {
      addQuestion({
        questionId: question.id,
        examId: exam.id,
        questionNumber: index,
      });
    } else {
      return toast.error("Unable to Add, not enough data...");
    }
  };

  useEffect(() => {
    const examIds = question.examQuestions?.map((item) => item.examId);
    const questionExams = exams?.filter((item) =>
      examIds?.find((id) => id === item.id)
    );
    if (questionExams) {
      setQuestionExams(questionExams);
    }
  }, [exams, question.examQuestions]);

  return (
    <Card className="dark:bg-slate-900 bg-slate-50">
      <CardContent className="p-0">
        <div className="flex flex-col hover:drop-shadow-xl p-2">
          <div className="flex justify-between">
            {/* if incorrect questions student name */}
            {!_.isEmpty(user) && (
              <Badge variant="outline" className="border border-primary">
                {user.name}
              </Badge>
            )}
          </div>

          <div className="flex justify-between h-full">
            <div className="flex gap-2 items-center h-full w-full">
              <div className="px-4 h-auto font-bold rounded-tl-lg rounded-bl-lg flex items-center justify-center">
                {index}
              </div>
              <div className="flex flex-col gap-1 py-1">
                <div className="flex-1 h-full">
                  <div className="line-clamp-2 tracking-wide font-sinhala">
                    {parse(question.body)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {questionExams &&
                    questionExams.length > 0 &&
                    questionExams.map((item, index) => (
                      <div className="relative group" key={index}>
                        <Badge
                          variant="outline"
                          className="w-fit uppercase border-primary"
                        >
                          {item.name}
                        </Badge>
                        <CircleX
                          className="w-4 h-4 absolute -top-2 -right-2 text-white font-bold group-hover:bg-red-500 rounded-full cursor-pointer"
                          onClick={() =>
                            removeQuestionFromExam({
                              questionId: question.id,
                              examId: item.id,
                            })
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="flex p-2 gap-2 items-center">
              {/* image */}
              {question.image && <ImageIcon />}

              {/* add to exam */}
              <div className="flex items-center hover:bg-opacity-70 cursor-pointer rounded-tr-lg">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <FilePlus className="text-blue-600 cursor-pointer" />
                  </AlertDialogTrigger>
                  <AlertDialogContent aria-describedby="add question to exam">
                    <AlertDialogTitle className="flex justify-between">
                      Add Question to Exam
                      <ExamPicker
                        setExam={setExam}
                        exam={exam}
                        subjectId={subjectId}
                        grade={grade}
                      />
                    </AlertDialogTitle>

                    <div className="py-1 flex flex-col">
                      <span className="text-sm font-sinhala">
                        {parse(question.body)}
                      </span>
                      <div className="flex gap-1 items-center">
                        <span>1.</span>
                        <span className="text-xs font-sinhala">
                          {question.option1}
                        </span>
                      </div>

                      <div className="flex gap-1 items-center">
                        <span>2.</span>
                        <span className="text-xs font-sinhala">
                          {question.option2}
                        </span>
                      </div>

                      <div className="flex gap-1 items-center">
                        <span>3.</span>
                        <span className="text-xs font-sinhala">
                          {question.option3}
                        </span>
                      </div>

                      <div className="flex gap-1 items-center">
                        <span>4.</span>
                        <span className="text-xs font-sinhala">
                          {question.option4}
                        </span>
                      </div>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={!exam}
                        onClick={addQuestionToExam}
                      >
                        Add
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* edit */}
              <div className="flex items-center hover:bg-opacity-70 cursor-pointer">
                <FilePenLine
                  className="text-green-600"
                  onClick={() =>
                    router.push(`/admin/questions/mcq/${question.id}`)
                  }
                />
              </div>

              {/* delete */}
              <div className="flex items-center overflow-hidden rounded-br-lg cursor-pointer hover:bg-opacity-70">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </AlertDialogTrigger>
                  <AlertDialogContent aria-describedby="delete question">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="flex flex-col gap-1 font-semibold">
                        <span>This action cannot be undone.</span>
                        <span>This will permanently delete this Question.</span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteQuestion(question.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default QuestionCard;
