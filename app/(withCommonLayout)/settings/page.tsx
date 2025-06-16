"use client";

import API from "@/lib/axios-client";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiGlobe, FiMail, FiPhone, FiSave, FiSettings } from "react-icons/fi";

interface Settings {
  appName: string;
  email: string;
  phone: string;
  website: string;
  logo?: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    appName: "",
    email: "",
    phone: "",
    website: "",
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("/app-settings");
      setSettings(response.data.data);
      if (response.data.data.logo) {
        setLogoPreview(response.data.data.logo);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeLogo = () => {
    setLogoPreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("appName", settings.appName);
      formData.append("email", settings.email);
      formData.append("phone", settings.phone);
      formData.append("website", settings.website);

      if (fileInputRef.current?.files?.[0]) {
        formData.append("logo", fileInputRef.current.files[0]);
      } else if (!logoPreview) {
        formData.append("removeLogo", "true");
      }
      await API.post("/app-settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh settings after save
      await fetchSettings();
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <FiSettings className="text-2xl text-blue-600 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Application Settings
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Logo Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Branding
          </h2>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex-shrink-0">
              <div className="relative group">
                <div className="w-32 h-32 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="App Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400">No logo</div>
                  )}
                </div>
                <div className="absolute inset-0 backdrop-blur-sm bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="p-2 bg-white rounded-full shadow-md text-blue-950 hover:bg-blue-50"
                    title="Change logo"
                  >
                    <FaEdit />
                  </button>
                  {logoPreview && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="ml-2 p-2 bg-white rounded-full shadow-md text-red-600 hover:bg-red-50"
                      title="Remove logo"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="flex-grow">
              <div className="mb-4">
                <label
                  htmlFor="appName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Application Name
                </label>
                <input
                  type="text"
                  id="appName"
                  name="appName"
                  value={settings.appName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your application name"
                  required
                />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Recommended logo size: 512×512 pixels. Max file size: 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Contact Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <FiMail className="text-gray-500 dark:text-gray-400 mr-3" />
              <div className="flex-grow">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="contact@example.com"
                />
              </div>
            </div>

            <div className="flex items-center">
              <FiPhone className="text-gray-500 dark:text-gray-400 mr-3" />
              <div className="flex-grow">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={settings.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="+1 (123) 456-7890"
                />
              </div>
            </div>

            <div className="flex items-center">
              <FiGlobe className="text-gray-500 dark:text-gray-400 mr-3" />
              <div className="flex-grow">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Website URL
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={settings.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center px-6 py-3 bg-blue-950 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors duration-200"
          >
            {isSaving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
