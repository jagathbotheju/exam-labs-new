"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteExam } from "@/server/backend/mutations/examMutations";
import { useState } from "react";

interface Props {
  trigger: React.ReactNode;
  examTitle: string;
  examId: string;
}

const DeleteExamDialog = ({ trigger, examTitle, examId }: Props) => {
  const { mutate: deleteExam } = useDeleteExam();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Subject</DialogTitle>
          <DialogDescription className="hidden">
            delete exam dialog
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <p>
            Are you sure, to delete this{" "}
            <span className="font-semibold text-red-500 uppercase">
              {examTitle}
            </span>{" "}
            Exam.
          </p>

          <p>
            All the <span className="font-semibold">Questions</span>, related to
            this Exam will also be deleted!
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            type="submit"
            onClick={() => {
              deleteExam(examId);
              setOpen(false);
            }}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteExamDialog;
