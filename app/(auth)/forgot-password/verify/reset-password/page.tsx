"use client";
import { resetPassword } from "@/lib/api";
import { getLocalStorage } from "@/utils/local-storage";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export type TResetPasswordData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const ForgotPassword = () => {
  const router = useRouter();
  const email = getLocalStorage("email");
  const [formData, setFormData] = useState<TResetPasswordData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    setError("");
    try {
      if (!email) {
        toast.error("Email not found. Please request a new one.");
        router.push("/forgot-password");
      }
      formData.email = email as string;
      const res = await resetPassword(formData);
      if (res?.success) {
        toast.success(res?.message);
        router.push("/login");
      }
    } catch (error) {
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-950 dark:text-white">
          Reset Password
        </h2>
        <form className="mt-4" onSubmit={handleReset}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mt-2 border dark:border-none rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full p-2 mt-2 border rounded-md dark:border-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {error && (
            <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
          )}
          <button
            disabled={loading}
            className={`w-full p-2 mt-4 bg-blue-950 text-white rounded-md cursor-pointer flex items-center justify-center transition ${
              loading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-800"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Submiting...
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
