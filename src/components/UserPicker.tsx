"use client";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { UserExt } from "@/server/db/schema/users";
import { useUsers } from "@/server/backend/queries/userQueries";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface Props {
  onChange: (user: UserExt | undefined) => void;
  user: UserExt | undefined;
}

const UserPicker = ({ user, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const { data: users, isPending } = useUsers();
  // const [value, setValue] = useState("");

  if (isPending) {
    return <Loader2 className="animate-spin" />;
  }

  if (!users?.length) {
    return <p className="text-xl font-semibold">No Users Found!</p>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="dark:bg-slate-900">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {user
            ? users.find((item) => item.id === user.id)?.name
            : "Select User..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
        <Command className="dark:bg-slate-900">
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup>
              {users.map((item) => (
                <CommandItem
                  key={item.id}
                  value={item.id}
                  onSelect={(currentValue) => {
                    const selectedUser = users.find(
                      (user) => user.id === currentValue
                    );
                    onChange(selectedUser);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      user?.id === item.id ? "opacity-100" : "opacity-0"
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
export default UserPicker;
