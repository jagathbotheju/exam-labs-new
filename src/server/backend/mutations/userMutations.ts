import { ProfileSchema } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { updateUserProfile } from "../actions/userActions";
import { useRouter } from "next/navigation";

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: ({
      formData,
      userId,
    }: {
      formData: z.infer<typeof ProfileSchema>;
      userId: string;
    }) => updateUserProfile({ formData, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      toast.success("Profile updated successfully");
      router.push("/");
    },
  });
};
