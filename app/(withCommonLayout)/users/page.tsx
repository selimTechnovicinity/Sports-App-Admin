"use client";

import Loading from "@/app/loading";
import { getAllUsers } from "@/lib/api";
import API from "@/lib/axios-client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FiEye, FiEyeOff, FiSearch } from "react-icons/fi";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  role: string;
  isDeleted?: boolean;
  __v?: number;
};

const Users = () => {
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>();
  const limit = 9;

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers("user", pageNo, limit, searchQuery);
      const usersData = res?.data;
      const totalPages = res?.pagination?.totalPages;

      setUsers(usersData || []);
      setTotalPages(totalPages);
    } catch {
      setError("No users found. Please add a user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageNo, searchQuery]);

  const toggleStatus = async (userId: string) => {
    try {
      await API.post(`/users/hide/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to update song status:", error);
    }
  };

  // Pagination Handlers
  const handleNext = () => {
    if (pageNo < totalPages) setPageNo((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (pageNo > 1) setPageNo((prev) => prev - 1);
  };

  const handlePageClick = (page: number) => {
    setPageNo(page);
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, pageNo - 2);
    const endPage = Math.min(totalPages, pageNo + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <main className="my-10 mx-auto w-full max-w-6xl px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Users
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage all users in the system
          </p>
        </div>

        {/* search  */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPageNo(1);
            }}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>
      {/* <div className="flex justify-end mr-5"> */}
      {/* <Link href="/users/create">
          <button className="bg-blue-950 dark:bg-blue-800 text-white px-4 py-2 rounded-lg transition hover:bg-blue-800 dark:hover:bg-blue-700">
            + Add new user
          </button>
        </Link> */}
      {/* </div> */}
      {error ? (
        <p className="ml-40 text-center font-bold mt-40 bg-red-600 w-200 p-5 text-white">
          {error}
        </p>
      ) : (
        <div>
          {loading && <Loading />}
          <div className="my-5 mx-auto w-full max-w-6xl">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Action</th>
                    <th className="p-3 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/users/edit/${user?._id}`}>
                          <div className="flex items-center rounded-lg p-1 hover:bg-blue-100">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={
                                  user?.photo || "/public/default-image.webp"
                                }
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user?.name}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user?.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-lg ${
                            user?.role === "Users"
                              ? "bg-blue-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {user?.role === "users" ? "Users" : user?.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleStatus(user._id)}
                          className={`flex items-center px-3 py-1 rounded-md ${
                            user.isDeleted === false
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800"
                              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800"
                          }`}
                        >
                          {user.isDeleted === false ? (
                            <>
                              <FiEye className="mr-1" />
                              Block
                            </>
                          ) : (
                            <>
                              <FiEyeOff className="mr-1" />
                              Unblock
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/users/edit/${user?._id}`}>
                          <button className="cursor-pointer text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition">
                            <FaEdit />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className=" left-0 w-ful  flex justify-center gap-2">
            <button
              onClick={handlePrev}
              disabled={pageNo === 1}
              className={`px-4 py-2 rounded-full ${
                pageNo === 1
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-950 dark:bg-blue-800 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition cursor-pointer"
              }`}
            >
              Previous
            </button>

            {getPaginationNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageClick(page)}
                className={`px-4 py-2 rounded-full ${
                  pageNo === page
                    ? "bg-blue-950 dark:bg-blue-800 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={pageNo === totalPages}
              className={`px-4 py-2 rounded-full ${
                pageNo === totalPages
                  ? "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-950 dark:bg-blue-800 text-white hover:bg-blue-800 dark:hover:bg-blue-700 transition cursor-pointer"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Users;
