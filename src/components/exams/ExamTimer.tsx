"use client";
import { addMinutes } from "date-fns";
import Countdown, { zeroPad } from "react-countdown";

interface Props {
  examDurationMin: number;
}

const ExamTimer = ({ examDurationMin }: Props) => {
  // const [bgColor, setBgColor] = useState("#000000");

  return (
    <Countdown
      date={addMinutes(new Date(), examDurationMin)}
      renderer={({ hours, minutes, seconds }) => (
        <div className="flex border border-primary/40 rounded-md items-center dark:bg-slate-900 bg-slate-100 z-50">
          <div className="text-2xl p-2 font-bold">
            <span>{zeroPad(hours)}</span>
          </div>
          <span>:</span>
          <div className="text-2xl p-2 font-bold">
            <span>{zeroPad(minutes)}</span>
          </div>
          <span>:</span>
          <div className="text-2xl p-2 font-bold">
            <span>{zeroPad(seconds)}</span>
          </div>
          {/* {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)} */}
        </div>
      )}
    />
  );
};
export default ExamTimer;
