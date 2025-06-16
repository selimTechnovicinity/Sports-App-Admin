"use client";

import Loading from "@/app/loading";
import { deleteFAQById } from "@/lib/api";
import API from "@/lib/axios-client";
import { Edit3, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type FAQSection = {
  title: string;
  content: string;
  _id: string;
};

type FAQData = {
  body: FAQSection[];
};

const ITEMS_PER_PAGE = 7;

const FAQ = () => {
  const [faqData, setFaqData] = useState<FAQData | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch FAQ data from backend
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/additonals/faq");
      const response = res.data;
      if (response?.page?.body) {
        setFaqData({ body: response.page.body });
        setTotalPages(Math.ceil(response.page.body.length / ITEMS_PER_PAGE));
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle FAQ item
  const toggleFAQ = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  // Handle Delete Confirmation
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await deleteFAQById(deleteId);
      if (res?.status === 200) {
        toast.success("Deleted successfully.");
      }
      setShowModal(false);
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error(error as string);
    }
  };

  // Cancel Delete
  const cancelDelete = () => {
    setDeleteId(null);
    setShowModal(false);
  };

  // Pagination Handlers
  const handlePageClick = (pageNumber: number) => {
    setPageNo(pageNumber);
    setExpanded(null); // Collapse all when changing pages
  };

  const handlePrev = () => {
    if (pageNo > 1) setPageNo(pageNo - 1);
  };

  const handleNext = () => {
    if (pageNo < totalPages) setPageNo(pageNo + 1);
  };

  // Calculate Paginated Data
  const startIndex = (pageNo - 1) * ITEMS_PER_PAGE;
  const paginatedData = faqData?.body.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex justify-center p-4 overflow-y-auto dark:bg-gray-900">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-950 dark:text-white">
            FAQ
          </h1>
          <Link href="/faq/create">
            <button className="bg-blue-950 text-white px-4 py-2 rounded-md cursor-pointer transition hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600">
              Add FAQ
            </button>
          </Link>
        </div>

        {loading ? (
          <Loading />
        ) : paginatedData ? (
          <div>
            {paginatedData.map((section, index) => (
              <div key={section._id} className="mb-3">
                <div className="border-b border-gray-300 dark:border-gray-600 mb-2 flex items-center justify-between">
                  <button
                    className="w-full text-left p-4 font-semibold text-gray-800 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 rounded-md transition hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => toggleFAQ(index)}
                  >
                    {section.title}
                  </button>

                  <div className="flex gap-2">
                    <Link href={`/faq/edit/${section._id}`}>
                      <button className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600">
                        <Edit3 size={20} />
                      </button>
                    </Link>
                    <button
                      className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
                      onClick={() => handleDeleteClick(section._id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                {expanded === index && (
                  <div className="p-4 ring-2 ring-green-500 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md transition">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400">
            No FAQ data available
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="left-0 w-full mt-10 mb-4 flex justify-center gap-2">
            <button
              onClick={handlePrev}
              disabled={pageNo === 1}
              className={`px-4 py-2 rounded-full transition ${
                pageNo === 1
                  ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-950 text-white dark:bg-blue-700 dark:text-white hover:bg-blue-800 dark:hover:bg-blue-600"
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageClick(index + 1)}
                className={`px-4 py-2 rounded-full transition ${
                  pageNo === index + 1
                    ? "bg-blue-950 text-white dark:bg-blue-700"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={pageNo === totalPages}
              className={`px-4 py-2 rounded-full transition ${
                pageNo === totalPages
                  ? "bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-950 text-white dark:bg-blue-700 dark:text-white hover:bg-blue-800 dark:hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed z-10 inset-0 flex items-center justify-center backdrop-blur-sm bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Delete Confirmation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this FAQ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
