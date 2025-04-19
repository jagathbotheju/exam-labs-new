"use client";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";
import { TooltipProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { format } from "date-fns";

interface Props extends TooltipProps<ValueType, NameType> {
  timeFrame: "month" | "year";
}

const CustomTooltip = ({ timeFrame, active, payload }: Props) => {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  const { marks, month, year, day } = data;

  const tipDate =
    timeFrame === "month" ? new Date(year, month, day) : new Date(year, month);
  const tipDateF =
    timeFrame === "month"
      ? format(tipDate, "MMM-dd")
      : format(tipDate, "yyyy-MMM");

  const TooltipRow = ({
    label,
    value,
    bgColor,
    textColor,
  }: {
    label: string;
    bgColor: string;
    textColor: string;
    value: number;
  }) => (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 items-center">
        <div className={cn("h-4 w-4 rounded-full", bgColor)} />
        <div className="flex w-full justify-between">
          <p className={cn("text-sm text-muted-foreground", textColor)}>
            {label}
          </p>
          <div className={cn("font-bold text-sm gap-1", textColor)}>
            <CountUp
              duration={0.5}
              preserveValue
              end={value}
              decimals={1}
              className="text-sm"
            />
          </div>
        </div>
      </div>
      <p className={cn("text-sm", textColor)}>{tipDateF}</p>
    </div>
  );

  if (active && marks === 0) {
    return null;
  }

  return (
    <div className="w-fit rounded-md border bg-background p-4">
      {marks !== 0 && (
        <TooltipRow
          label="marks"
          value={marks}
          bgColor="bg-emerald-500"
          textColor="text-emerald-500"
        />
      )}
    </div>
  );
};

export default CustomTooltip;
