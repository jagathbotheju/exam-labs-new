"use client";

import { useTimeFrameStore } from "@/stores/useTimeFrameStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const MonthSelector = () => {
  const { period, setPeriod } = useTimeFrameStore();

  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month, index) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            { month: "long" }
          );

          return (
            <SelectItem key={month + index} value={(month + 1).toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default MonthSelector;
