"use client";

import { toast } from "@/hooks/use-toast";
import { createTerms, getTerms } from "@/lib/api";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineStrikethrough,
} from "react-icons/ai";
import { BsTypeUnderline } from "react-icons/bs";
import TurndownService from "turndown";

type PrivacySection = {
  title: string;
  content: string;
};

export type PrivacyData = {
  body: PrivacySection[];
};

const CreateTermsPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const turndownService = new TurndownService();

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content,
    editorProps: {
      attributes: {
        class: "prose min-h-[200px] py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => {
      // const text = editor.getText();
      // setContent(text);
      const html = editor.getHTML();
      setContent(html);
    },
    immediatelyRender: false,
  });

  // Fetch privacy data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const terms = await getTerms();
        if (terms?.page?.body) {
          setTitle(terms?.page?.body[0]?.title);
          setContent(terms?.page?.body[0]?.content);
          const markdown = turndownService.turndown(
            terms?.page?.body[0]?.content
          );
          // setContent(markdown);
          if (editor) {
            editor.commands.setContent(markdown);
          }
        } else {
          toast({ title: "Failed to fetch terms data" });
        }
      } catch (error) {
        toast({ title: error as string });
      }
    };

    fetchData();
  }, [editor]);

  const handleSubmit = async () => {
    const privacyData: PrivacyData = {
      body: [
        {
          title,
          content,
        },
      ],
    };

    try {
      const res = await createTerms(privacyData);
      if (res?.message) {
        toast({ title: res?.message });
        router.push("/terms");
      } else {
        toast({ title: "Failed to update terms" });
      }
    } catch (error) {
      toast({ title: error as string });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {title || "Update Terms and Conditions"}
        </h1>

        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
          <input
            type="text"
            required
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
            placeholder="Titolo"
          />

          {/* Toolbar */}
          {editor && (
            <div className="flex flex-wrap gap-2 mb-2">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-2 py-1 rounded ${
                  editor.isActive("bold")
                    ? "bg-blue-950 text-white"
                    : "bg-gray-200 dark:bg-gray-600 dark:text-white"
                }`}
              >
                <AiOutlineBold />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-2 py-1 rounded ${
                  editor.isActive("italic")
                    ? "bg-blue-950 text-white"
                    : "bg-gray-200 dark:bg-gray-600 dark:text-white"
                }`}
              >
                <AiOutlineItalic />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`px-2 py-1 rounded ${
                  editor.isActive("underline")
                    ? "bg-blue-950 text-white"
                    : "bg-gray-200 dark:bg-gray-600 dark:text-white"
                }`}
              >
                <BsTypeUnderline />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`px-2 py-1 rounded ${
                  editor.isActive("strike")
                    ? "bg-blue-950 text-white"
                    : "bg-gray-200 dark:bg-gray-600 dark:text-white"
                }`}
              >
                <AiOutlineStrikethrough />
              </button>
            </div>
          )}

          {/* Editor Area */}
          <EditorContent
            className="border rounded-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
            editor={editor}
          />
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-950 text-white px-4 py-2 rounded cursor-pointer transition hover:bg-blue-800 dark:hover:bg-blue-700"
          >
           Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTermsPage;
