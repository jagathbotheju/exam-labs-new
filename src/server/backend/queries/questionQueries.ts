import { useQuery } from "@tanstack/react-query";
import {
  getExamQuestions,
  getIncorrectQuestions,
  getQuestionById,
  getQuestions,
  getQuestionsBySubject,
  getQuestionsBySubjectPagination,
  getQuestionsCount,
} from "../actions/questionActions";

export const useQuestions = () => {
  return useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions(),
  });
};

export const useQuestionsCount = ({
  grade,
  subjectId,
}: {
  grade: string;
  subjectId: string;
}) => {
  return useQuery({
    queryKey: ["questions-count"],
    queryFn: () => getQuestionsCount({ grade, subjectId }),
  });
};

export const useQuestionsBySubject = (subjectId: string) => {
  return useQuery({
    queryKey: ["questions-by-subject"],
    queryFn: () => getQuestionsBySubject(subjectId),
  });
};

export const useQuestionsBySubjectGradePagination = ({
  subjectId,
  grade,
  page,
}: {
  subjectId: string;
  grade: string;
  page: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ["questions-by-subject-pagination", subjectId, grade, page],
    queryFn: () => getQuestionsBySubjectPagination({ subjectId, grade, page }),
    // enabled: !!grade && !!subjectId,
  });
};

export const useQuestionById = (questionId: string) => {
  return useQuery({
    queryKey: ["question-by-id"],
    queryFn: () => getQuestionById(questionId),
  });
};

export const useExamQuestions = () => {
  return useQuery({
    queryKey: ["exam-questions"],
    queryFn: () => getExamQuestions(),
  });
};

export const useIncorrectQuestions = ({
  userId,
  subjectId,
}: {
  userId?: string;
  subjectId?: string;
}) => {
  return useQuery({
    queryKey: ["incorrect-questions"],
    queryFn: () => getIncorrectQuestions({ userId, subjectId }),
  });
};
