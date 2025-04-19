"use client";
import { useSubjects } from "@/server/backend/queries/subjectQueries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";
import _ from "lodash";
import DeleteSubjectDialog from "./DeleteSubjectDialog";

const AllSubjects = () => {
  const { data: subjects, isLoading } = useSubjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (_.isEmpty(subjects) || !subjects) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-bold text-muted-foreground">
          No Subject Found!, Please add one
        </h1>
      </div>
    );
  }

  return (
    <Table className="w-full md:max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Subject</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subject) => (
          <TableRow key={subject.id}>
            <TableCell className="font-medium whitespace-nowrap">
              {subject.id}
            </TableCell>
            <TableCell className="uppercase">{subject.title}</TableCell>
            <TableCell className="text-left text-slate-200">
              <DeleteSubjectDialog
                subjectTitle={subject.title}
                subjectId={subject.id}
                trigger={<Trash2 className="w-4 cursor-pointer text-red-500" />}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default AllSubjects;
