"use client";
import {
  useMonthHistoryData,
  useYearHistoryData,
} from "@/server/backend/queries/historyQueries";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
// import HistoryPeriodSelector from "../history/HistoryPeriodSelector";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "../CustomTooltip";
import _ from "lodash";
import { useSubjects } from "@/server/backend/queries/subjectQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { User } from "@/server/db/schema/users";
import SubjectPicker from "../SubjectPicker";
import { useTimeFrameStore } from "@/stores/useTimeFrameStore";
import HistoryPeriodSelector from "../HistoryPeriodSelector";

interface Props {
  user: User;
}

const ResultSummary = ({ user }: Props) => {
  const queryClient = useQueryClient();
  const { period, timeFrame } = useTimeFrameStore();
  const [subjectId, setSubjectId] = useState("");
  const { data: subjects } = useSubjects();
  const subject = subjects?.find((item) => item.id === subjectId);

  const { data: monthHistoryData, isLoading: monthHistoryFetching } =
    useMonthHistoryData({
      subjectId,
      userId: user.id,
      month: period.month,
      year: period.year,
      grade: user.grade as string,
    });
  console.log("monthHistoryData", monthHistoryData);

  const { data: yearHistoryData, isLoading: yearHistoryFetching } =
    useYearHistoryData({
      subjectId,
      userId: user.id,
      year: period.year,
      grade: user.grade as string,
    });

  useEffect(() => {
    if (subjectId && user && period) {
      queryClient.invalidateQueries({ queryKey: ["month-history-data"] });
      queryClient.invalidateQueries({ queryKey: ["year-history-data"] });
    }
  }, [subjectId, queryClient, user, period]);

  return (
    <Card className="bg-transparent dark:border-primary/40">
      <CardHeader>
        <CardTitle className="flex w-full flex-col">
          <div className="flex justify-between flex-col">
            <p className="text-2xl font-bold">
              Result Summary {`,${user.name}`}
              <span className="text-primary font-semibold uppercase">
                {subject?.title}
              </span>
            </p>

            <div className="flex gap-4 mt-5 self-end">
              <SubjectPicker onChange={setSubjectId} value={subjectId} />
              <HistoryPeriodSelector />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {monthHistoryFetching || yearHistoryFetching ? (
          <div className="mt-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : !subjectId ? (
          <div className="flex w-full mt-10 justify-center">
            <h2 className="text-3xl font-semibold text-muted-foreground">
              Please Select Subject
            </h2>
          </div>
        ) : _.isEmpty(yearHistoryData) || _.isEmpty(monthHistoryData) ? (
          <Card className="flex h-[300px] flex-col items-center justify-center bg-background dark:bg-transparent">
            No Data for the selected period!
            <p className="text-sm text-muted-foreground">
              Try selecting different period or adding new Transactions
            </p>
          </Card>
        ) : (
          <ResponsiveContainer width={"100%"} height={300}>
            <BarChart
              height={300}
              data={timeFrame === "month" ? monthHistoryData : yearHistoryData}
              barCategoryGap={5}
            >
              <defs>
                <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#10b981" stopOpacity="1" />
                  <stop offset="1" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ef4444" stopOpacity="1" />
                  <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" strokeOpacity="0.2" />
              <XAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                padding={{ left: 5, right: 5 }}
                dataKey={(data) => {
                  const { year, month, day } = data;
                  const date = new Date(year, month, day || 1);
                  if (timeFrame === "year") {
                    return date.toLocaleDateString("default", {
                      month: "long",
                    });
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
              <Bar
                dataKey="marks"
                label="Marks"
                fill="url(#incomeBar)"
                radius={4}
                className="cursor-pointer"
              />

              <Tooltip
                filterNull
                cursor={{ opacity: 0.1 }}
                content={(props) => (
                  <CustomTooltip timeFrame={timeFrame} {...props} />
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
export default ResultSummary;
