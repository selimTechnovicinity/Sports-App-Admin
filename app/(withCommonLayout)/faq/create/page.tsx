"use client";
import { toast } from "@/hooks/use-toast";
import { createFAQ, getFAQ } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FAQSection = {
  title: string;
  content: string;
};

export type FAQData = {
  body: FAQSection[];
};

const EditPrivacyPolicy = () => {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [faqData, setFaqData] = useState<FAQSection[]>([]);

  // Fetch existing FAQ data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFAQ();
        if (response?.page?.body) {
          setFaqData(response?.page?.body);
        } else {
          toast({ title: "No FAQ data found" });
        }
      } catch (error) {
        toast({ title: error as string });
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    // Append the new FAQ to existing FAQs
    const updatedFaqData: FAQData = {
      body: [
        ...faqData,
        {
          title,
          content,
        },
      ],
    };

    try {
      const res = await createFAQ(updatedFaqData);
      if (res?.message) {
        toast({ title: res?.message });
        router.push("/faq");
      } else {
        toast({ title: "Failed to create FAQ" });
      }
    } catch (error) {
      toast({ title: error as string });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Create New FAQ
        </h1>

        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2  rounded  bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            placeholder="Question"
          />
          <textarea
            value={content}
            required
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 mb-2  rounded  bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            placeholder="Answer"
            rows={4}
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-950 dark:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer transition hover:bg-blue-800 dark:hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPrivacyPolicy;
