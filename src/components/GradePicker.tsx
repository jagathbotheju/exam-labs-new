"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { grades } from "@/lib/constants";
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

interface Props {
  onChange: (value: string) => void;
  value: string;
  editMode?: boolean;
}

const GradePicker = ({ onChange, value, editMode = true }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="dark:bg-slate-900">
        <Button
          variant="outline"
          disabled={!editMode}
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-[200px] justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {value
            ? grades?.find((item) => item.label === value)?.label
            : "Select grade..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-slate-900">
        <Command className="dark:bg-slate-900 w-full">
          <CommandInput placeholder="Search grades..." className="w-full" />
          <CommandList>
            <CommandEmpty>No grades found</CommandEmpty>
            <CommandGroup>
              {grades?.map((item, index) => (
                <CommandItem
                  key={index}
                  value={item.label}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default GradePicker;
