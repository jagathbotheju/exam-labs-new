import { AddSubjectSchema } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { addSubject, deleteSubject } from "../actions/subjectActions";
import { toast } from "sonner";

export const useAddSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: z.infer<typeof AddSubjectSchema>) =>
      addSubject(formData),
    onSuccess: async (res) => {
      const message = res?.success;
      toast.success(message);
      await queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
    onError: (res) => {
      const err = res.message;
      toast.error(err);
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subjectId: string) => deleteSubject(subjectId),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["subjects"] });
      const message = res?.success;
      toast.success(message);
    },
  });
};
