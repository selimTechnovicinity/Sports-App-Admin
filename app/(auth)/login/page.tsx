"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginMutationFn } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export type TLoginData = {
  email: string;
  password: string;
};

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: loginMutationFn,
    onSuccess: (res) => {
      if (res.data.data.user.role === "Admin") {
        console.log(res?.data);
        Cookies.set("accessToken", res?.data?.data?.accessToken);
        Cookies.set("refreshToken", res?.data?.data?.refreshToken);
        toast.success(res.data.message);
        router.push("/dashboard");
      } else {
        setError("Only admin can login");
      }
    },
    onError: (error: any) => {
      setError(error?.response?.data?.message);
      toast.error(
        error?.response?.data?.message || "Failed to login. Please try again."
      );
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-950 dark:text-white">
          Login as Admin
        </h2>
        <form className="mt-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mt-2 border dark:border-none rounded-md dark:bg-gray-700 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mt-2 border dark:border-none rounded-md dark:bg-gray-700 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {mutation.isError && (
            <div className="mt-3 text-sm text-red-600 dark:text-red-400">
              {error || "Failed to login. Please try again."}
            </div>
          )}
          <button
            type="submit"
            className={`w-full p-2 mt-4 bg-blue-950 text-white rounded-md cursor-pointer flex items-center justify-center transition ${
              mutation.isPending
                ? "opacity-75 cursor-not-allowed"
                : "hover:bg-blue-800"
            }`}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Loging...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="mt-2 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-950 dark:text-blue-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
