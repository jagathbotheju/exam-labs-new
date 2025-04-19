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
import { FormControl } from "./ui/form";
import { answersMcq } from "@/lib/constants";

interface Props {
  onChange: (value: string) => void;
  value: string;
}

const AnswerPicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="dark:bg-slate-900">
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? answersMcq?.find((answer) => answer.value === value)?.label
              : "Select answer"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
        <Command className="dark:bg-slate-900">
          <CommandInput placeholder="Search answers..." />
          <CommandList>
            <CommandEmpty>No grades found.</CommandEmpty>
            <CommandGroup>
              {answersMcq?.map((answer) => (
                <CommandItem
                  key={answer.value}
                  value={answer.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      answer.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {answer.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AnswerPicker;
