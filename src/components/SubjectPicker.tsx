"use client";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { useSubjects } from "@/server/backend/queries/subjectQueries";

interface Props {
  onChange: (value: string) => void;
  value: string;
}

const SubjectPicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const { data: subjects } = useSubjects();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="dark:bg-slate-900">
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-[200px] justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {value
            ? subjects?.find((subject) => subject.id === value)?.title
            : "Select subject"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
        <Command className="dark:bg-slate-900">
          <CommandInput placeholder="Search subjects..." />
          <CommandList>
            <CommandEmpty>No subject found.</CommandEmpty>
            <CommandGroup>
              {subjects?.map((subject) => (
                <CommandItem
                  key={subject.id}
                  value={subject.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      subject.id === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {subject.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SubjectPicker;
