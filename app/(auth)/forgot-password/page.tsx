"use client";

import API from "@/lib/axios-client";
import { setLocalStorage } from "@/utils/local-storage";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const forgotPasswordMutation = useMutation({
    mutationFn: () => API.post("/auth/forget-password", { email }),
    onSuccess: (res) => {
      if (res?.data.success) {  
        setLocalStorage("email", email);
        router.push("/forgot-password/verify");
      }
    },
    onError: (error) => {
      const err = error as AxiosError<{ message?: string }>;
      setError(err?.response?.data?.message || "Something went wrong.");
    },
  });

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    forgotPasswordMutation.mutate();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-950 dark:text-white">
          Enter your email
        </h2>
        <form className="mt-4" onSubmit={handleReset}>
          <input
            type="email"
            required
            placeholder="Enter your email"
            className={`w-full p-2 mt-2 border rounded-md dark:bg-gray-700 dark:text-white ${
              error
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button
            type="submit"
            disabled={forgotPasswordMutation.isPending}
            className={`w-full p-2 mt-4 bg-blue-950 text-white rounded-md flex items-center justify-center transition ${
              forgotPasswordMutation.isPending
                ? "opacity-75 cursor-not-allowed"
                : "hover:bg-blue-800"
            }`}
          >
            {forgotPasswordMutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
