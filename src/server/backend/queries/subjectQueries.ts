import { useQuery } from "@tanstack/react-query";
import { getSubjectById, getSubjects } from "../actions/subjectActions";

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => getSubjects(),
  });
};

export const useSubjectById = (subjectId: string) => {
  return useQuery({
    queryKey: ["subject-by-id"],
    queryFn: () => getSubjectById(subjectId),
  });
};
