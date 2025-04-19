"use client";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { ExamExt } from "@/server/db/schema/exams";
import {
  useExams,
  useExamsBySubjectGrade,
} from "@/server/backend/queries/examQueries";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface Props {
  setExam: (exam: ExamExt | undefined) => void;
  exam: ExamExt | undefined;
  subjectId: string;
  grade: string;
}

const ExamPicker = ({ exam, setExam, subjectId, grade }: Props) => {
  const [open, setOpen] = useState(false);
  const { data: exams } = useExams();
  const { data: examsBySubject, isPending } = useExamsBySubjectGrade({
    subjectId,
    grade,
  });

  if (isPending) {
    return <Loader2 className="animate-spin" />;
  }

  if (!examsBySubject) {
    return <p className="text-xl font-semibold">No Exams Found!</p>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {exam
            ? examsBySubject.find((item) => item.id === exam.id)?.name
            : "Select an Exam..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search exam..." />
          <CommandList>
            <CommandEmpty>No exams found.</CommandEmpty>
            <CommandGroup>
              {examsBySubject.map((item) => (
                <CommandItem
                  className="uppercase"
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue) => {
                    const selectedExam = exams?.find(
                      (exam) => exam.id === currentValue
                    );
                    setExam(selectedExam);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      exam?.id === item.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default ExamPicker;
