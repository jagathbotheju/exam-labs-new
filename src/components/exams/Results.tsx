"use client";
import { useState } from "react";
import { User, UserExt } from "@/server/db/schema/users";
import UserPicker from "../UserPicker";
import MyExams from "./MyExams";
import ResultSummaryLineChart from "./ResultSummaryLineChart";

interface Props {
  admin: User;
}

const Results = ({ admin }: Props) => {
  const [selectedUser, setSelectedUser] = useState<UserExt | undefined>();

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full items-center justify-between">
        <p className="text-2xl font-bold">Exam Results</p>
        <UserPicker onChange={setSelectedUser} user={selectedUser} />
      </div>

      <div className="mt-8">
        {selectedUser && <ResultSummaryLineChart user={selectedUser} />}
      </div>

      <div className="mt-8">
        {selectedUser ? (
          <MyExams role={admin.role ?? undefined} user={selectedUser} />
        ) : (
          <div className="flex justify-center mt-8">
            <h2 className="text-3xl font-bold text-muted-foreground">
              Please select a Student
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};
export default Results;
