import { useQuery } from "@tanstack/react-query";
import { getUserById, getUsers } from "../actions/userActions";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
};

export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ["user-by-id"],
    queryFn: () => getUserById(userId),
  });
};
