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
import { AddSubjectSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAddSubject } from "@/server/backend/mutations/subjectMutations";
import { Loader2 } from "lucide-react";
import { useSubjects } from "@/server/backend/queries/subjectQueries";
import { toast } from "sonner";

const AddSubject = () => {
  const { data: subjects } = useSubjects();
  const { mutate, isPending } = useAddSubject();
  const router = useRouter();
  const form = useForm<z.infer<typeof AddSubjectSchema>>({
    resolver: zodResolver(AddSubjectSchema),
    defaultValues: {
      title: "",
    },
    mode: "all",
  });

  const onSubmit = (formData: z.infer<typeof AddSubjectSchema>) => {
    const subjectFound = subjects?.find(
      (subject) => subject.title === formData.title
    );
    if (subjectFound) {
      return toast.error("Subject Already Exist");
    }
    mutate(formData);
    form.reset();
  };

  return (
    <div className="mt-2 w-full max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* subject title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Name</FormLabel>
                <FormControl>
                  <Input {...field} className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 mt-8">
            <Button type="submit" className="inline-flex gap-2">
              {isPending && <Loader2 className="w-4 h-4" />}
              {isPending ? "Creating..." : "Create"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AddSubject;
