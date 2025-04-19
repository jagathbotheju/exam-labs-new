"use client";
import React from "react";
import YearSelector from "./YearSelector";
import { TimeFrame } from "@/lib/types";
import MonthSelector from "./MonthSelector";
import { useTimeFrameStore } from "@/stores/useTimeFrameStore";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

// interface Props {
//   subjectId: string;
// }

const HistoryPeriodSelector = () => {
  const { timeFrame, setTimeFrame } = useTimeFrameStore();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Tabs
        value={timeFrame}
        onValueChange={(value) => {
          setTimeFrame(value as TimeFrame);
        }}
      >
        <TabsList>
          <TabsTrigger value="year">Year</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items=center gap-2">
        <YearSelector />

        {timeFrame === "month" && <MonthSelector />}
      </div>
    </div>
  );
};

export default HistoryPeriodSelector;
