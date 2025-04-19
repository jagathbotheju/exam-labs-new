"use client";
import { AddExamSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useAddExam } from "@/server/backend/mutations/examMutations";

import SubjectPicker from "../SubjectPicker";
import GradePicker from "../GradePicker";

const AddExam = () => {
  const router = useRouter();
  const { mutate, isPending } = useAddExam();
  const form = useForm<z.infer<typeof AddExamSchema>>({
    resolver: zodResolver(AddExamSchema),
    defaultValues: {
      name: "",
      subject: "",
      duration: 0,
      grade: "",
    },
    mode: "all",
  });

  const onSubmit = (examData: z.infer<typeof AddExamSchema>) => {
    mutate({ examData });
    form.reset();
  };

  return (
    <div className="mt-2 w-full max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-between">
            {/* subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Subject</FormLabel>
                  <SubjectPicker
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* grade */}
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Grade</FormLabel>
                  <GradePicker
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Name</FormLabel>
                <FormControl>
                  <Input {...field} className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 mt-8">
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              className="inline-flex gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4" />}
              {isPending ? "Creating..." : "Create"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              type="button"
              className="dark:bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AddExam;
