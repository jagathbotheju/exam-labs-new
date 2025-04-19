"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "./ui/toggle";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  UnderlineIcon,
} from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import Underline from "@tiptap/extension-underline";
import { cn } from "@/lib/utils";

const TipTap = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  const { setValue } = useFormContext();
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Underline,
      StarterKit.configure({
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal pl-4",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc pl-4",
          },
        },
      }),
    ],
    onUpdate: ({ editor }) => {
      //if you want to extract html only, without JS
      //can you sanitize-html npm package
      const content = editor.getHTML(); //.getText();
      setValue("body", content, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 tracking-widest dark:bg-slate-900 bg-slate-50 text-lg",
          className
        ),
      },
    },
    content: "",
  });

  useEffect(() => {
    editor?.commands.clearContent();
    if (editor && value) {
      const prev = editor.getText();
      if (prev !== value) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  return (
    <div className="flex flex-col gap-2">
      {editor && (
        <div className="flex items-center gap-2">
          {/* bold */}
          <Toggle
            variant="outline"
            size="sm"
            className="w-fit"
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="w-4 h-4" />
          </Toggle>

          {/* underline */}
          <Toggle
            variant="outline"
            size="sm"
            className="w-fit"
            pressed={editor.isActive("underline")}
            onPressedChange={() =>
              editor.chain().focus().toggleUnderline().run()
            }
          >
            <UnderlineIcon className="w-4 h-4" />
          </Toggle>

          {/* italic */}
          <Toggle
            variant="outline"
            size="sm"
            className="w-fit"
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="w-4 h-4" />
          </Toggle>

          {/* strike */}
          <Toggle
            variant="outline"
            size="sm"
            className="w-fit"
            pressed={editor.isActive("strike")}
            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="w-4 h-4" />
          </Toggle>

          {/* ordered list */}
          <Toggle
            variant="outline"
            size="sm"
            className="w-fit"
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          >
            <ListOrdered className="w-4 h-4" />
          </Toggle>

          {/* bullet list */}
          <Toggle
            variant="outline"
            size="sm"
            className="w-fit"
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          >
            <List className="w-4 h-4" />
          </Toggle>
        </div>
      )}
      <EditorContent
        editor={editor}
        className="tracking-wide font-sinhala text-lg!"
      />
    </div>
  );
};

export default TipTap;
