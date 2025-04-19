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
import { useDeleteSubject } from "@/server/backend/mutations/subjectMutations";
import { useState } from "react";

interface Props {
  trigger: React.ReactNode;
  subjectTitle: string;
  subjectId: string;
}

const DeleteSubjectDialog = ({ trigger, subjectTitle, subjectId }: Props) => {
  const { mutate } = useDeleteSubject();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Subject</DialogTitle>
          <DialogDescription className="hidden">
            delete subject dialog
          </DialogDescription>
          <div className="flex flex-col">
            <div>
              Are you sure, to delete this{" "}
              <span className="font-semibold text-red-500 uppercase">
                {subjectTitle}
              </span>{" "}
              subject
            </div>

            <div>
              All the <span className="font-semibold">Questions</span>, related
              to this subject will also be deleted!
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            type="submit"
            onClick={() => mutate(subjectId)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteSubjectDialog;
