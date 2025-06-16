"use client";

import API from "@/lib/axios-client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiCalendar,
  FiEdit,
  FiLock,
  FiMail,
  FiSave,
  FiShield,
} from "react-icons/fi";
import { toast } from "react-toastify";

interface UserData {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserData>();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await API.get("/users");
      setUser(response.data.data);
      reset(response.data.data);
      // setSelectedImage(response.data.data.image);
    } catch (error) {
      toast.error(error as string | "Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: UserData) => {
    try {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await API.post(`/users`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchUserData();
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error as string | "Failed to update profile");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedImage(files[0]);
    }

    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-200 p-6 text-blue-950 ">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">User Profile</h1>
              <button
                onClick={handleEditToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer ${
                  isEditing
                    ? "bg-white text-blue-950"
                    : "bg-blue-950 text-white"
                }`}
              >
                {isEditing ? (
                  <>
                    <FiSave className="inline" /> Save Changes
                  </>
                ) : (
                  <>
                    <FiEdit className="inline" /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column - Avatar */}
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <div className="relative mb-4">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={160}
                        height={160}
                        className="rounded-full border-4 border-white shadow-lg object-cover w-40 h-40"
                      />
                    ) : user?.image ? (
                      <Image
                        src={user?.image}
                        alt="Profile"
                        width={160}
                        height={160}
                        className="rounded-full border-4 border-white shadow-lg object-cover w-40 h-40"
                      />
                    ) : (
                      <div className="rounded-full bg-gray-200 w-40 h-40 flex items-center justify-center text-gray-500 text-4xl font-bold">
                        {user?.first_name.charAt(0)}
                        {user?.last_name.charAt(0)}
                      </div>
                    )}

                    {isEditing && (
                      <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                        <label className="cursor-pointer">
                          <FiEdit className="text-blue-950" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <input
                            {...register("first_name", {
                              required: "First name is required",
                            })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.first_name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.first_name.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            {...register("last_name", {
                              required: "Last name is required",
                            })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          />
                          {errors.last_name && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.last_name.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <h2 className="text-xl font-semibold">
                        {user?.first_name} {user?.last_name}
                      </h2>
                    )}
                    <div className="mt-2 flex items-center justify-center gap-2 text-gray-600">
                      <FiShield className="text-blue-500" />
                      <span>{user?.role}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="w-full md:w-2/3 space-y-6">
                  {/* Email */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 text-gray-700 mb-2">
                      <FiMail className="text-blue-500" />
                      <h3 className="font-medium">Email Address</h3>
                    </div>
                    {isEditing ? (
                      <input
                        {...register("email")}
                        disabled
                        className="w-full px-4 py-2 bg-gray-100 rounded-lg text-gray-700"
                      />
                    ) : (
                      <p className="text-gray-900">{user?.email}</p>
                    )}
                  </div>

                  {/* Account Created */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 text-gray-700 mb-2">
                      <FiCalendar className="text-blue-500" />
                      <h3 className="font-medium">Account Created</h3>
                    </div>
                    <p className="text-gray-900">
                      {new Date(user?.createdAt || "").toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  {/* Last Updated */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 text-gray-700 mb-2">
                      <FiCalendar className="text-blue-500" />
                      <h3 className="font-medium">Last Updated</h3>
                    </div>
                    <p className="text-gray-900">
                      {new Date(user?.updatedAt || "").toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>

                  {/* Password Reset - Always visible but only actionable in edit mode */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 text-gray-700 mb-2">
                      <FiLock className="text-blue-500" />
                      <h3 className="font-medium">Password</h3>
                    </div>
                    {isEditing ? (
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() =>
                          toast.info(
                            "Password reset functionality would go here"
                          )
                        }
                      >
                        Change Password
                      </button>
                    ) : (
                      <p className="text-gray-500">********</p>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      if (user) {
                        reset(user);
                      }
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
