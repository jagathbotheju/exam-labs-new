import { useQuery } from "@tanstack/react-query";
import {
  getExamById,
  getExams,
  getExamsBySubjectGrade,
  getUserExam,
  getUserExamsCount,
  getUserExamsPagination,
} from "../actions/examActions";

export const useExams = () => {
  return useQuery({
    queryKey: ["exams"],
    queryFn: () => getExams(),
  });
};

export const useExamById = (examId: string) => {
  return useQuery({
    queryKey: ["exam-by-id", examId],
    queryFn: () => getExamById(examId),
  });
};

export const useExamsBySubjectGrade = ({
  subjectId,
  grade,
}: {
  subjectId: string;
  grade: string;
}) => {
  return useQuery({
    queryKey: ["exams-subject-grade", subjectId, grade],
    queryFn: () => getExamsBySubjectGrade({ subjectId, grade }),
  });
};

// export const useStudentExams = (studentId: string) => {
//   return useQuery({
//     queryKey: ["student-exams", studentId],
//     queryFn: () => getStudentExams(studentId),
//   });
// };

export const useUserExamsPagination = ({
  userId,
  page,
  grade,
}: {
  userId: string;
  page: number;
  pageSize?: number;
  grade: string;
}) => {
  return useQuery({
    queryKey: ["student-exams", userId, page, grade],
    queryFn: () => getUserExamsPagination({ userId, page, grade }),
  });
};

export const useUserExamsCount = (userId: string) => {
  return useQuery({
    queryKey: ["user-exams-count", userId],
    queryFn: () => getUserExamsCount(userId),
  });
};

export const useUserExam = ({
  userId,
  examId,
}: {
  userId: string;
  examId: string;
}) => {
  return useQuery({
    queryKey: ["user-exam", userId, examId],
    queryFn: () => getUserExam({ userId, examId }),
  });
};
