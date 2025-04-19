import { useQuery } from "@tanstack/react-query";
import { getUserAnswers } from "../actions/answerActions";

export const useUserAnswers = ({
  examId,
  userId,
}: {
  examId: string;
  userId: string;
}) => {
  return useQuery({
    queryKey: ["user-answers", examId, userId],
    queryFn: () => getUserAnswers({ userId, examId }),
  });
};
