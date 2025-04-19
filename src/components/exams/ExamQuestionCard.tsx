"use client";
import { Question } from "@/server/db/schema/questions";
import { Card, CardContent } from "../ui/card";
import parse from "html-react-parser";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useRemoveQuestionFromExam } from "@/server/backend/mutations/questionMutations";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import Image from "next/image";
import { UserAnswer } from "@/server/db/schema/userAnswers";
import { UserResponse } from "@/lib/types";

interface Props {
  question: Question;
  questionNumber: number;
  examId: string;
  role: string;
  answerExamQuestion?: (userResponse: UserResponse) => void;
  answer?: UserAnswer;
  completed?: boolean;
  index?: number;
}

const ExamQuestionCard = ({
  question,
  questionNumber,
  examId,
  answerExamQuestion,
  answer,
  role = "user",
  completed = false,
  index,
}: Props) => {
  const { mutate: removeQuestionFromExam } = useRemoveQuestionFromExam();

  const isAnswerCorrect = answer
    ? answer.questionAnswer === answer.userAnswer
    : false;

  return (
    <Card className="dark:bg-transparent dark:border-primary/40 w-full p-0">
      <CardContent className="p-0 w-fll flex flex-col">
        <div className="bg-primary/40 p-2 rounded-tl-lg rounded-tr-lg">
          <div className="font-bold rounded-full p-3 border-2 border-primary w-4 h-4 flex items-center justify-center">
            {questionNumber}
          </div>
        </div>
        <div className="flex flex-col hover:drop-shadow-xl relative">
          <div className="flex relative">
            <div className="flex gap-2 items-center relative w-full">
              {/* question */}
              <RadioGroup
                className="w-full"
                onValueChange={(value) => {
                  if (answerExamQuestion) {
                    answerExamQuestion({
                      questionId: question.id,
                      questionAnswer: question.answer,
                      userAnswer: value,
                    });
                  }
                }}
              >
                <div className="flex flex-col gap-2 p-3 w-full">
                  {/* question body */}
                  <div className="tracking-wide font-sinhala text-xl flex justify-between">
                    <div>{parse(question.body)}</div>
                    {question.image && (
                      <Image
                        alt="question image"
                        src={question.image}
                        width={200}
                        height={200}
                        className="object-cover z-10"
                      />
                    )}
                  </div>

                  {/* option-1 */}
                  <div className="flex items-center space-x-2 relative">
                    <RadioGroupItem
                      disabled={role === "admin" || completed}
                      className="w-5 h-5 border border-primary"
                      value="option1"
                      id={index + "option1"}
                      {...(answer &&
                        answer.userAnswer === "option1" && {
                          checked: true,
                        })}
                    />
                    <Label
                      htmlFor={index + "option1"}
                      className={`${!completed && "cursor-pointer"}`}
                    >
                      <p className="text-lg tracking-wide font-sinhala">
                        {question.option1}
                      </p>
                    </Label>

                    {!isAnswerCorrect &&
                      completed &&
                      answer &&
                      answer.questionAnswer === "option1" && (
                        <Image
                          className="absolute -top-4 -left-6"
                          src="/images/err-circle.png"
                          alt="wrong answer"
                          width={60}
                          height={60}
                        />
                      )}
                  </div>

                  {/* option-2 */}
                  <div className="flex items-center space-x-2 relative">
                    <RadioGroupItem
                      disabled={role === "admin" || completed}
                      className="w-5 h-5 border border-primary cursor-pointer"
                      value="option2"
                      id={index + "option2"}
                      {...(answer &&
                        answer.userAnswer === "option2" && {
                          checked: true,
                        })}
                    />
                    <Label
                      htmlFor={index + "option2"}
                      className={`${!completed && "cursor-pointer"}`}
                    >
                      <p className="text-lg tracking-wide font-sinhala">
                        {question.option2}
                      </p>
                    </Label>

                    {!isAnswerCorrect &&
                      completed &&
                      answer &&
                      answer.questionAnswer === "option2" && (
                        <Image
                          className="absolute -top-4 -left-6"
                          src="/images/err-circle.png"
                          alt="wrong answer"
                          width={60}
                          height={60}
                        />
                      )}
                  </div>

                  {/* option-3 */}
                  {question.option3 && (
                    <div className="flex items-center space-x-2 relative">
                      <RadioGroupItem
                        disabled={role === "admin" || completed}
                        className="w-5 h-5 border border-primary cursor-pointer"
                        value="option3"
                        id={index + "option3"}
                        {...(answer &&
                          answer.userAnswer === "option3" && {
                            checked: true,
                          })}
                      />
                      <Label
                        htmlFor={index + "option3"}
                        className={`${!completed && "cursor-pointer"}`}
                      >
                        <p className="text-lg tracking-wide font-sinhala">
                          {question.option3}
                        </p>
                      </Label>

                      {!isAnswerCorrect &&
                        completed &&
                        answer &&
                        answer.questionAnswer === "option3" && (
                          <Image
                            className="absolute -top-4 -left-6"
                            src="/images/err-circle.png"
                            alt="wrong answer"
                            width={60}
                            height={60}
                          />
                        )}
                    </div>
                  )}

                  {/* option-4 */}
                  {question.option4 && (
                    <div className="flex items-center space-x-2 relative">
                      <RadioGroupItem
                        disabled={role === "admin" || completed}
                        className="w-5 h-5 border border-primary cursor-pointer"
                        value="option4"
                        id={index + "option4"}
                        {...(answer &&
                          answer.userAnswer === "option4" && {
                            checked: true,
                          })}
                      />
                      <Label
                        htmlFor={index + "option4"}
                        className={`${!completed && "cursor-pointer"}`}
                      >
                        <p className="text-lg tracking-wide font-sinhala">
                          {question.option4}
                        </p>
                      </Label>

                      {!isAnswerCorrect &&
                        completed &&
                        answer &&
                        answer.questionAnswer === "option4" && (
                          <Image
                            className="absolute -top-4 -left-6"
                            src="/images/err-circle.png"
                            alt="wrong answer"
                            width={60}
                            height={60}
                          />
                        )}
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>

            {/* answer correctness */}
            <div className="z-20 absolute bottom-10 right-[20%]">
              {isAnswerCorrect && completed && (
                <div className="flex flex-col gap-2 items-center">
                  <Image
                    src="/images/check-icon.png"
                    alt="correct answer"
                    width={60}
                    height={60}
                  />
                  {/* <p className="font-sinhala">{questionType}</p> */}
                </div>
              )}

              {!isAnswerCorrect && completed && (
                <div className="flex flex-col gap-2 items-center">
                  <Image
                    src="/images/cross-icon.png"
                    alt="wrong answer"
                    width={60}
                    height={60}
                  />
                  {/* <p className="font-sinhala">{questionType}</p> */}
                </div>
              )}
            </div>
          </div>

          {/* delete question */}
          {role === "admin" && (
            <AlertDialog>
              <AlertDialogTrigger>
                <Trash2 className="absolute w-5 h-5 right-4 bottom-4 text-red-500 cursor-pointer hover:text-red-800" />
              </AlertDialogTrigger>
              <AlertDialogContent aria-describedby="delete question">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="flex flex-col gap-1">
                    <span>This action cannot be undone.</span>
                    <span>
                      This will remove delete Question from this Exam.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500"
                    onClick={() =>
                      removeQuestionFromExam({
                        questionId: question.id,
                        examId: examId,
                      })
                    }
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default ExamQuestionCard;
