"use client";

import { toast } from "@/hooks/use-toast";
import { getFAQById, updateFAQById } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type UpdateFAQData = {
  title: string;
  content: string;
};

const EditPrivacyPolicy = () => {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const faq = await getFAQById(id as string);
        if (faq?.page) {
          setTitle(faq?.page?.body[0]?.title || "");
          setContent(faq?.page?.body[0]?.content || "");
        } else {
          toast({ title: "FAQ not found." });
          router.push("/faq");
        }
      } catch (error) {
        toast({ title: (error as string) || "Failed to fetch FAQ data." });
        router.push("/faq");
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmit = async () => {
    const faqData: UpdateFAQData = {
      title,
      content,
    };

    try {
      const res = await updateFAQById(id as string, faqData);
      if (res?.message) {
        toast({ title: res?.message });
        router.push("/faq");
      } else {
        toast({ title: "Failed to update FAQ" });
      }
    } catch (error) {
      toast({
        title: (error as string) || "An error occurred while updating.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Edit FAQ
        </h1>

        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 rounded  bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            placeholder="Question"
          />
          <textarea
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-80 p-2 mb-2 rounded  bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            placeholder="Answer"
            rows={4}
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-950 dark:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition hover:bg-blue-800 dark:hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPrivacyPolicy;
