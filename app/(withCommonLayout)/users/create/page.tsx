"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import { userRegister } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type TRegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: "operator" | "restaurant" | "super-admin";
};

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TRegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "operator",
  });

  const [localError, setLocalError] = useState<string>("");

  const mutation = useMutation({
    mutationFn: userRegister,
    onSuccess: (res) => {
      if (res?.data?.user) {
        toast({ title: "Account created successfully." });
        router.push("/operators");
      } else {
        const message = res?.message || "Failed to create account.";
        toast(message);
        setLocalError(message);
      }
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Failed to create account.";
      toast({ title: message });
      setLocalError(message);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    setLocalError("");
    mutation.mutate(formData);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          Create User
        </h2>
        <form className="mt-4" onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-2 mt-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 mt-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mt-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirma Password"
            className="w-full p-2 mt-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full p-2 mt-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="w-full p-2 mt-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="operator">User</option>
            {/* Add more roles here if needed */}
          </select>

          {localError && (
            <p className="text-red-600 dark:text-red-400 mt-2 text-center">
              {localError}
            </p>
          )}

          <button
            type="submit"
            className={`w-full p-2 mt-4 bg-blue-950 dark:bg-blue-800 text-white rounded-md flex items-center justify-center transition ${
              mutation.isPending
                ? "opacity-75 cursor-not-allowed"
                : "hover:bg-blue-800 dark:hover:bg-blue-700"
            }`}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Creating...
              </>
            ) : (
              "Create"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
