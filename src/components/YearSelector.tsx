"use client";
import React from "react";
import { useHistoryYears } from "@/server/backend/queries/historyQueries";
import { useTimeFrameStore } from "@/stores/useTimeFrameStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// interface Props {
//   subjectId: string;
// }

const YearSelector = () => {
  const { period, setPeriod } = useTimeFrameStore();
  const { data: historyYears } = useHistoryYears();

  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {historyYears?.map((year, index) => (
          <SelectItem key={year + index} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default YearSelector;
