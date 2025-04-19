"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState, useTransition } from "react";
import { Edit, Loader2 } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { ProfileSchema } from "@/lib/schema";
import ImageUpload from "../ImageUpload";
import { User } from "@/server/db/schema/users";
import GradePicker from "../GradePicker";
import { useUpdateUserProfile } from "@/server/backend/mutations/userMutations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Props {
  user: User;
}

const Profile = ({ user }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [editMode, setEditMode] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      image: user.image ? user.image : "",
      school: user.school || "",
      grade: user.grade || "",
    },
    mode: "all",
  });

  const { mutate: updateUserProfile } = useUpdateUserProfile();

  const onSubmit = (formData: z.infer<typeof ProfileSchema>) => {
    startTransition(async () => {
      if (files.length > 0) {
        const uploadedImages = await startUpload(files);
        if (!uploadedImages) return;
        formData.image = uploadedImages[0].ufsUrl;
      }
      updateUserProfile({ formData, userId: user.id });
    });
  };

  return (
    <div className="flex w-full flex-col gap-4 mb-10 mt-4">
      <Card className="dark:bg-slate-900 border-primary/40">
        <CardHeader>
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-2xl font-bold capitalize">
                {user.name}, Profile Settings
              </CardTitle>
              <CardDescription className="text-sm">
                {user.email}
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Edit
                    className="w-8 h-8 cursor-pointer"
                    onClick={() => setEditMode(!editMode)}
                  />
                </TooltipTrigger>
                <TooltipContent>Edit Profile</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex gap-8">
                {/* profile image */}
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
                          editMode={!editMode}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col w-[50%] gap-4">
                  {/* name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input disabled={!editMode} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* school */}
                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School</FormLabel>
                        <FormControl>
                          <Input disabled={!editMode} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* grade */}
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl>
                          <GradePicker
                            editMode={editMode}
                            onChange={(value) => field.onChange(value)}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                className="w-fit self-end"
                disabled={!form.formState.isValid || isPending || !editMode}
                type="submit"
              >
                {isPending && <Loader2 className="mr-2 animate-spin" />}{" "}
                {isPending ? "Updating..." : "Update"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Profile;
