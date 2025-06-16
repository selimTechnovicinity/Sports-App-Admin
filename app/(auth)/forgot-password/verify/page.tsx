"use client";

import { forgetPassword } from "@/lib/api";
import API from "@/lib/axios-client";
import { getLocalStorage, setLocalStorage } from "@/utils/local-storage";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const RESEND_OTP_DELAY = 30;

const SubmitOTP = () => {
  const [otp, setOTP] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [resendTimer, setResendTimer] = useState<number>(0);
  const router = useRouter();
  const email = getLocalStorage("email");

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  // Submit OTP mutation
  const submitOTPMutation = useMutation({
    mutationFn: () =>
      API.post(`/auth/forget-password/verify-otp`, {
        email: email as string,
        otp,
      }),
    onSuccess: (res) => {
      if (res?.data.success) {
        toast.success(res.data.message);
        setLocalStorage("OTP", otp);
        router.push("/forgot-password/verify/reset-password");
      }
    },
    onError: (error) => {
      const err = error as AxiosError<{ message?: string }>;
      setError(err?.response?.data?.message || "An unexpected error occurred.");
    },
  });

  // Resend OTP mutation
  const resendOTPMutation = useMutation({
    mutationFn: async () => {
      if (!email) {
        router.push("/forgot-password");
        return;
      }
      return forgetPassword({ email });
    },
    onSuccess: (res) => {
      toast.success(res.message);
      setResendTimer(RESEND_OTP_DELAY);
    },
    onError: (error) => {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
    },
  });

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error
    submitOTPMutation.mutate();
  };

  const handleResendOTP = () => {
    resendOTPMutation.mutate();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-950 dark:text-white">
          Submit OTP
        </h2>
        <form className="mt-4" onSubmit={handleReset}>
          <input
            required
            placeholder="Enter OTP from your email"
            className={`w-full p-2 mt-2 border rounded-md dark:bg-gray-700 dark:text-white ${
              error
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <button
            type="submit"
            disabled={submitOTPMutation.isPending}
            className={`w-full p-2 mt-4 bg-blue-950 text-white rounded-md flex items-center justify-center transition ${
              submitOTPMutation.isPending
                ? "opacity-75 cursor-not-allowed"
                : "hover:bg-blue-800"
            }`}
          >
            {submitOTPMutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendOTP}
            disabled={resendOTPMutation.isPending || resendTimer > 0}
            className={`w-full p-2 mt-2 bg-blue-950 text-white rounded-md transition ${
              resendOTPMutation.isPending || resendTimer > 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-800"
            }`}
          >
            {resendOTPMutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Resending...
              </>
            ) : resendTimer > 0 ? (
              `Resend OTP in ${resendTimer}s`
            ) : (
              "Resend OTP"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitOTP;
