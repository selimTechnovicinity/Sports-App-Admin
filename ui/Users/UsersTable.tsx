"use client";
import { TUser } from "@/app/(withCommonLayout)/users/page";
import API from "@/lib/axios-client";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function UsersTable({ users }: { users: TUser[] }) {
  const toggleStatus = async (userId: string) => {
    try {
      const data = await API.post(`/users/hide/${userId}`);
    } catch (error) {
      console.error("Failed to update song status:", error);
    }
  };
  return (
    <div className="my-5 mx-auto w-full max-w-6xl px-4">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-300">
          <thead>
            <tr className="bg-blue-100 dark:bg-gray-700">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Edit</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={index}
                className="even:bg-blue-100 odd:bg-white dark:even:bg-gray-800 dark:odd:bg-gray-900"
              >
                <td className="p-3">{user?.name}</td>
                <td className="p-3">{user?.phone}</td>
                <td className="p-3">{user?.email}</td>
                <td className="p-3">
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
                        Hide
                      </>
                    ) : (
                      <>
                        <FiEyeOff className="mr-1" />
                        Show
                      </>
                    )}
                  </button>
                </td>
                <td className="p-3 flex space-x-2">
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
  );
}
