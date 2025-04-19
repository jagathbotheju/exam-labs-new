"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { AddMcqQuestionSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import _ from "lodash";
import ImageUpload from "../ImageUpload";
import { useUploadThing } from "@/lib/uploadthing";
import TipTap from "../Tiptap";
import { useAddQuestion } from "@/server/backend/mutations/questionMutations";
import { useQuestionById } from "@/server/backend/queries/questionQueries";
import GradePicker from "../GradePicker";
import TermPicker from "../TermPicker";
import SubjectPicker from "../SubjectPicker";
import AnswerPicker from "../AnswerPicker";

interface Props {
  questionId?: string;
}

const AddMcqQuestion = ({ questionId }: Props) => {
  const router = useRouter();
  const { mutate: addQuestion, isPending } = useAddQuestion();

  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof AddMcqQuestionSchema>>({
    resolver: zodResolver(AddMcqQuestionSchema),
    defaultValues: {
      body: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      grade: "",
      term: "",
      subject: "",
      answer: "",
      image: "",
    },
    mode: "all",
  });

  const { data: question } = useQuestionById(questionId as string);

  useEffect(() => {
    form.reset();

    if (question && !_.isEmpty(question)) {
      form.setValue("grade", question[0].grade);
      form.setValue("term", question[0].term);
      form.setValue("subject", question[0].subjectId);
      form.setValue("body", question[0].body);
      form.setValue("option1", question[0].option1 ?? "");
      form.setValue("option2", question[0].option2 ?? "");
      form.setValue("option3", question[0].option3 ?? "");
      form.setValue("option4", question[0].option4 ?? "");
      form.setValue("answer", question[0].answer);
      form.setValue("image", question[0].image ?? "");
    }
  }, [question, form]);

  const onSubmit = (questionData: z.infer<typeof AddMcqQuestionSchema>) => {
    startTransition(async () => {
      if (files.length > 0) {
        const uploadedImages = await startUpload(files);
        if (!uploadedImages) return;
        questionData.image = uploadedImages[0].ufsUrl;
        addQuestion({ questionData, questionId });
      } else {
        addQuestion({ questionData, questionId });
      }
    });

    router.push(
      `/admin/questions?subjectId=${form.getValues(
        "subject"
      )}&grade=${form.getValues("grade")}`
    );
  };

  return (
    <div className="mt-2 w-full flex flex-col gap-4 dark:bg-slate-900 bg-slate-50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-5">
            <div className="flex flex-col gap-5">
              <div className="flex gap-5 items-center w-full">
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

                {/* term */}
                <FormField
                  control={form.control}
                  name="term"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Term</FormLabel>
                      <TermPicker
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </div>

              {/* question body */}
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <div className="w-full h-full">
                        <TipTap value={field.value} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                      setFiles={setFiles}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between gap-5"></div>

          {/* option-1 */}
          <FormField
            control={form.control}
            name="option1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option 1</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="tracking-wide font-sinhala text-lg!"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* option-2 */}
          <FormField
            control={form.control}
            name="option2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option 2</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="tracking-wide font-sinhala text-lg!"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* option-3 */}
          <FormField
            control={form.control}
            name="option3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option 3</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="tracking-wide font-sinhala text-lg!"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* option-4 */}
          <FormField
            control={form.control}
            name="option4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option 4</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="tracking-wide font-sinhala text-lg!"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* answer */}
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Answer</FormLabel>
                <AnswerPicker
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-8 flex gap-2">
            <Button type="submit">
              {questionId ? "Update" : isPending ? "Creating..." : "Create"}
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            </Button>
            <Button
              className="dark:bg-slate-900"
              onClick={() => {
                router.push(
                  `/admin/questions?subjectId=${form.getValues(
                    "subject"
                  )}&grade=${form.getValues("grade")}`
                );
                form.reset();
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AddMcqQuestion;
