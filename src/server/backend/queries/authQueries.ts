import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../actions/authActions";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: () => getCurrentUser(),
  });
};
