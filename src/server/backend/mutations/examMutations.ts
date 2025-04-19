import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addExam,
  addExamToUser,
  cancelUserExam,
  completeExamAction,
  completeExamTest,
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

export const useCompleteExamTest = () => {
  return useMutation({
    mutationFn: () => completeExamTest(200),
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
    }: {
      examId: string;
      subjectId: string;
      userId: string;
      completedAt: string;
      marks: number;
      duration: number;
    }) => {
      return completeExamAction({
        examId,
        subjectId,
        userId,
        completedAt,
        marks,
        duration,
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

export const useCompleteExam = () => {
  console.log("completing exam mut...");
  return useMutation({
    mutationFn: ({
      examId,
      subjectId,
      userId,
      completedAt,
      marks,
      duration,
    }: {
      examId: string;
      subjectId: string;
      userId: string;
      completedAt: string;
      marks: number;
      duration: number;
    }) =>
      completeExamAction({
        examId,
        subjectId,
        userId,
        completedAt,
        marks,
        duration,
      }),
    onError: (err) => {
      console.log("error mut", err.message);
    },
    onSuccess: (res) => {
      console.log(res);
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
    mutationFn: ({ examId, userId }: { examId: string; userId: string }) =>
      addExamToUser({ examId, userId }),
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
  console.log("mutate-deleteExamFromUser....");

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
