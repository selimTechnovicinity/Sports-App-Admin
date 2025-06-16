"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import { updatePassword } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type TUpdatePasswordData = {
  oldPassword: string;
  password: string;
  confirmPassword: string;
};

const UpdatePassword = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TUpdatePasswordData>({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const mutation = useMutation({
    mutationFn: updatePassword,
    onSuccess: (res) => {
      if (res?.status === "success") {
        toast({ title: "Password update successfully." });
        router.push("/update-profile");
      } else {
        toast({ title: res?.message || "Failed to update password." });
      }
    },
    onError: (error: any) => {
      toast({
        title: error?.response?.data?.message || "Failed to update password.",
      });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match.",
      });
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Update Password
        </h2>
        <form className="mt-4 mb-4" onSubmit={handleReset}>
          <input
            type="password"
            name="oldPassword"
            placeholder="Current Password"
            className="w-full mb-4 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            value={formData.oldPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="New Password"
            className="w-full mb-4 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full mb-4 p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          {mutation.isError && (
            <p className="text-red-600 dark:text-red-400 mt-2 text-center">
              {mutation.error?.response?.data?.message ||
                "Failed to update password."}
            </p>
          )}

          <button
            type="submit"
            className={`w-full p-2 mt-4 bg-blue-950 dark:bg-blue-800 text-white rounded-md hover:bg-blue-800 dark:hover:bg-blue-700 transition flex items-center justify-center ${
              mutation.isPending ? "opacity-75 cursor-not-allowed" : ""
            }`}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
