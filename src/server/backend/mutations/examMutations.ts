import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addExam,
  addExamToUser,
  cancelUserExam,
  completeExamAction,
  deleteExam,
  deleteExamFromUser,
} from "../actions/examActions";
import { toast } from "sonner";
import { AddExamSchema } from "@/lib/schema";
import { z } from "zod";
import { useRouter } from "next/navigation";

export const useAddExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examData }: { examData: z.infer<typeof AddExamSchema> }) =>
      addExam({ examData }),
    onSuccess: async (res) => {
      const message = res?.success;
      toast.success(message);
      await queryClient.invalidateQueries({ queryKey: ["exams-by-subject"] });
      await queryClient.invalidateQueries({
        queryKey: ["exams-subject-grade"],
      });
    },
    onError: (res) => {
      const err = res.message;
      toast.error(err);
    },
  });
};

export const useCompleteExamMutation = () => {
  return useMutation({
    mutationFn: ({
      examId,
      subjectId,
      userId,
      completedAt,
      marks,
      duration,
      grade,
    }: {
      examId: string;
      subjectId: string;
      userId: string;
      completedAt: string;
      marks: number;
      duration: number;
      grade: string;
    }) => {
      return completeExamAction({
        examId,
        subjectId,
        userId,
        completedAt,
        marks,
        duration,
        grade,
      });
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => deleteExam(examId),
    onSuccess: async (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["exams-by-subject"] });
        await queryClient.invalidateQueries({
          queryKey: ["exams-subject-grade"],
        });
        return toast.success(res.success);
      }
      if (res.error) {
        return toast.error(res.error);
      }
    },
    onError: () => {
      toast.error("Could not delete Exam");
    },
  });
};

export const useCancelUserExam = () => {
  return useMutation({
    mutationFn: ({ examId, userId }: { examId: string; userId: string }) =>
      cancelUserExam({ examId, userId }),
    onSuccess: (res) => {
      if (res.success) {
        // queryClient.invalidateQueries({ queryKey: ["questions-by-subject"] });
        toast.success(res.success);
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: () => {
      toast.error("Exam could not be assign to Student");
    },
  });
};

export const useAddExamToUser = () => {
  // const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      examId,
      userId,
      grade,
    }: {
      examId: string;
      userId: string;
      grade: string;
    }) => addExamToUser({ examId, userId, grade }),
    onSuccess: (res) => {
      if (res.success) {
        // queryClient.invalidateQueries({ queryKey: ["questions-by-subject"] });
        router.back();
        toast.success(res.success);
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: () => {
      toast.error("Exam could not be assign to Student");
    },
  });
};

export const useDeleteExamFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examId, userId }: { examId: string; userId: string }) =>
      deleteExamFromUser({ examId, userId }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        queryClient.invalidateQueries({ queryKey: ["student-exams"] });
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: () => {
      toast.error("Exam could not be assign to Student");
    },
  });
};
