"use client";

import Loading from "@/app/loading";
import { getPrivacy } from "@/lib/api";

import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TurndownService from "turndown";

type PrivacySection = {
  title: string;
  content: string;
};

export type PrivacyData = {
  body: PrivacySection[];
};

const EditPrivacyPolicy = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    editable: false,
    injectCSS: false,
    immediatelyRender: false,
  });

  // Fetch privacy data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const terms = await getPrivacy();
        if (terms?.page?.body) {
          setTitle(terms?.page?.body[0]?.title);
          const markdown = turndownService.turndown(
            terms?.page?.body[0]?.content
          );
          setContent(markdown);
          // setContent(terms?.page?.body[0]?.content);
          if (editor) {
            editor.commands.setContent(markdown);
          }
        } else {
          toast.error("Failed to fetch privacy policy data.");
        }
      } catch (error) {
        toast.error(error as string);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editor]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loading />
        </div>
      ) : (
        <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            {title}
          </h1>
          <Link href="/privacy/create">
            <button className="bg-blue-950 dark:bg-blue-700 text-white mb-3 px-4 py-2 rounded cursor-pointer transition hover:bg-blue-800 dark:hover:bg-blue-600">
              Edit
            </button>
          </Link>
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
            {/* Editor Area */}
            <EditorContent
              className="text-gray-800 dark:text-gray-100"
              editor={editor}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPrivacyPolicy;
