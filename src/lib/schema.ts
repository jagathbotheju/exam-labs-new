import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  grade: z.string().min(1, "please select grade"),
  school: z.string().min(1, "school is required"),
});

export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "email address is required")
    .email("please provide valid e-mail address"),
});

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
    token: z.string().optional().nullable(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export const RegisterSchema = z
  .object({
    name: z.string().min(1, "name is required"),
    email: z
      .string()
      .min(1, "email address is required")
      .email("please provide valid e-mail address"),
    dob: z.date({
      required_error: "date of birth is required.",
    }),
    school: z.string().min(1, "email address is required"),
    grade: z.string().min(1, "please select grade"),
    password: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(1, "password is required")
      .min(6, "password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "email address is required")
    .email("please provide valid e-mail address"),
  password: z
    .string()
    .min(1, "password is required")
    .refine((pw) => pw.length > 6, {
      message: "at least 6 characters required",
    }),
});

export const AddMcqQuestionSchema = z.object({
  id: z.string().optional(),
  body: z.string().min(1, "question text is required"),
  option1: z.string(),
  option2: z.string(),
  option3: z.string(),
  option4: z.string(),
  grade: z.string().min(1, "please select grade"),
  term: z.string().min(1, "please select term"),
  subject: z.string({ required_error: "please select a subject" }),
  // type: z.string().min(1, "please select question type").nullable(),
  answer: z.string().min(1, "please select an Answer"),
  image: z.string().optional(),
});

export const AddSubjectSchema = z.object({
  title: z.string().min(1, "subject name is required"),
});

export const AddQuestionTypeSchema = z.object({
  type: z.string().min(1, "type name is required"),
});

export const AddExamSchema = z.object({
  name: z.string().min(1, "name is required"),
  subject: z.string().min(1, "subject is required"),
  grade: z.string().min(1, "subject is required"),
  duration: z.coerce
    .number({
      required_error: "duration is required",
      invalid_type_error: "duration must be a number",
    })
    .int("please enter valid time")
    .gt(2, "must be grater than 2 minute"),
});
