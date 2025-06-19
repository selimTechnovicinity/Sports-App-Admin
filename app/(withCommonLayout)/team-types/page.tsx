"use client";

import API from "@/lib/axios-client";
import DeleteButton from "@/ui/Button/DeleteButton";
import AddModal from "@/ui/Modal/AddModal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import { toast } from "react-toastify";

interface TeamType {
  _id: string;
  title: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export default function TeamTypesPage() {
  const [teamTypes, setTeamTypes] = useState<TeamType[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValue, setFormValue] = useState<{
    title: string;
    image: string | File;
  }>({
    title: "",
    image: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamTypes();
  }, [pagination.currentPage]);

  const fetchTeamTypes = async () => {
    try {
      const res = await API.get(
        `/team-types?page=${pagination.currentPage}&limit=${pagination.limit}`
      );
      console.log(res.data.data);
      setTeamTypes(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Error fetching Team types:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/team-types/${id}`);
      toast.success("Team type deleted successfully");
      fetchTeamTypes();
    } catch (err) {
      toast.error(err as string | "Failed to delete team type");
    }
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await API.post(`/team-types/${editingId}`, formValue, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Team type updated successfully!");
      } else {
        await API.post(`/team-types`, formValue, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Team type created successfully!");
      }
      setIsModalOpen(false);
      setFormValue({ title: "", image: "" });
      setEditingId(null);
      fetchTeamTypes();
    } catch (err) {
      toast.error((err as string) || "Failed to save team type.");
    }
  };

  const openEditModal = (teamType: TeamType) => {
    setFormValue({
      title: teamType.title,
      image: teamType.image,
    });
    setEditingId(teamType._id);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-950"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Team Types
        </h1>
        <button
          className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
          onClick={() => {
            setIsModalOpen(true);
            setEditingId(null);
            setFormValue({ title: "", image: "" });
          }}
        >
          <FaPlus className="text-sm" /> Add Team Type
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {teamTypes?.map((teamType) => (
                <tr
                  key={teamType._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        src={teamType?.image}
                        alt={teamType.title}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {teamType.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(teamType.createdAt || "").toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => openEditModal(teamType)}
                        className="text-blue-950 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 cursor-pointer"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      {/* <button
                        onClick={() => handleDelete(teamType._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 cursor-pointer"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button> */}
                      <DeleteButton
                        type={teamType}
                        handleDelete={handleDelete}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <div className="flex-1 flex justify-between items-center sm:hidden">
            <button
              onClick={() =>
                handlePageChange(Math.max(1, pagination.currentPage - 1))
              }
              disabled={pagination.currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                handlePageChange(
                  Math.min(pagination.totalPages, pagination.currentPage + 1)
                )
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.currentPage * pagination.limit,
                    pagination.totalItems
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.totalItems}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                >
                  <span className="sr-only">First</span>
                  <FiChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.currentPage - 1))
                  }
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (
                      pagination.currentPage >=
                      pagination.totalPages - 2
                    ) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium cursor-pointer ${
                          pagination.currentPage === pageNum
                            ? "z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-950 text-blue-950 dark:text-blue-200 "
                            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(
                        pagination.totalPages,
                        pagination.currentPage + 1
                      )
                    )
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                >
                  <span className="sr-only">Last</span>
                  <FiChevronsRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <AddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Team Type" : "Add Team Type"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formValue.title}
              onChange={(e) =>
                setFormValue({ ...formValue, title: e.target.value })
              }
              placeholder="Enter team type"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files;
                if (files && files[0]) {
                  setFormValue({ ...formValue, image: files[0] });
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* {formValue.image && (
            <div className="flex justify-center">
              <Image
                src={formValue.image}
                alt="Preview"
                width={150}
                height={150}
                className="rounded-md object-cover border border-gray-200 dark:border-gray-600"
              />
            </div>
          )} */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-950 rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
            >
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </AddModal>
    </div>
  );
}
