"use client";
import {
  useMonthHistoryDataForSubjects,
  useYearHistoryDataForSubjects,
} from "@/server/backend/queries/historyQueries";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSubjects } from "@/server/backend/queries/subjectQueries";
import { Loader2 } from "lucide-react";
import { User } from "@/server/db/schema/users";
import { useTimeFrameStore } from "@/stores/useTimeFrameStore";
import HistoryPeriodSelector from "../HistoryPeriodSelector";
import { ChartData } from "@/lib/types";
import { getDaysInMonth } from "date-fns";
import { lineColors, yearLabels } from "@/lib/constants";

interface Props {
  user: User;
}

const ResultSummaryLineChart = ({ user }: Props) => {
  const { period, timeFrame } = useTimeFrameStore();
  const { data: subjects } = useSubjects();

  const subjectIds = subjects?.map((item) => item.id);

  const monthHistoryResult = useMonthHistoryDataForSubjects({
    subjectIds: subjectIds as [string],
    userId: user.id,
    month: period.month,
    year: period.year,
    grade: user.grade as string,
  });
  const yearHistoryResult = useYearHistoryDataForSubjects({
    subjectIds: subjectIds as [string],
    userId: user.id,
    year: period.year,
    grade: user.grade as string,
  });

  // month history data
  const monthHistoryData = () => {
    const monthData = [] as ChartData[];
    const monthChartData = [];
    const daysInMonth = getDaysInMonth(new Date(period.year, period.month - 1));

    monthHistoryResult?.forEach((item) => {
      item.data?.forEach((historyData) => {
        const data: ChartData = {
          day: historyData.day,
          month: historyData.month,
          year: historyData.year,
          [subjects?.find((sub) => sub.id === historyData.subjectId)?.title ??
          ""]: historyData.marks ?? 0,
        };
        monthData.push(data);
      });
    });

    for (let i = 0; i <= daysInMonth; i++) {
      const filtered = monthData.filter((item) => item.day === i + 1);
      const data = Object.assign({}, ...filtered);
      monthChartData.push(data);
    }
    return monthChartData;
  };
  const monthHistoryChartData = monthHistoryData();

  // year history data
  const yearHistoryData = () => {
    const yearData = [] as ChartData[];
    const yearChartData = [];

    yearHistoryResult?.forEach((item) => {
      item.data?.forEach((historyData) => {
        const data: ChartData = {
          month: historyData.month,
          year: historyData.year,
          [subjects?.find((sub) => sub.id === historyData.subjectId)?.title ??
          ""]: historyData.marks ?? 0,
        };
        yearData.push(data);
      });
    });

    for (let i = 0; i < 12; i++) {
      const filtered = yearData.filter((item) => item.month === i + 1);
      const data = Object.assign({}, ...filtered);
      yearChartData.push(data);
    }

    return yearChartData;
  };
  const yearHistoryChartData = yearHistoryData();

  // useEffect(() => {
  //   if (subjectIds && user && period) {
  //     queryClient.invalidateQueries({
  //       queryKey: ["month-history-data-subjects"],
  //     });
  //     // queryClient.invalidateQueries({ queryKey: ["year-history-data"] });
  //   }
  // }, [subjectIds, queryClient, user, period]);

  return (
    <Card className="bg-transparent dark:border-primary/40">
      <CardHeader>
        <CardTitle className="flex w-full flex-col">
          <div className="flex justify-between flex-col">
            <p className="text-2xl font-bold">
              Result Summary{" "}
              <span className="text-primary">{`,${user.name}`}</span>
            </p>

            <div className="self-end">
              <HistoryPeriodSelector />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!monthHistoryChartData.length || !yearHistoryChartData.length ? (
          <div className="flex mt-8 justify-center items-center">
            <Loader2 className="animate-spin w-8 h-8" />
          </div>
        ) : (
          <ResponsiveContainer width={"100%"} height={300}>
            <LineChart
              height={300}
              data={
                timeFrame === "month"
                  ? monthHistoryChartData
                  : yearHistoryChartData
              }
              barCategoryGap={5}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <Legend />
              <XAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={5}
                dataKey={(data) => {
                  const { year, month, day } = data;
                  const date = new Date(year, month, day);
                  if (timeFrame === "year") {
                    return yearLabels[month - 1];
                  }
                  return date.toLocaleDateString("default", {
                    day: "2-digit",
                  });
                }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              {subjects &&
                subjects.map((subject, index) => (
                  <Line
                    key={subject.id}
                    dataKey={subject.title}
                    stroke={lineColors[index % lineColors.length]}
                    strokeWidth={2}
                    type="monotone"
                  />
                ))}

              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
export default ResultSummaryLineChart;
