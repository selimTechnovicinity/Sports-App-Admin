"use client";
import Navbar from "@/ui/shared/navbar/Navbar";
import Sidebar from "@/ui/shared/sidebar/Sidebar";
import React, { useState } from "react";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-[210px]" : "ml-0"
        }`}
      >
        {/* Fixed Navbar */}
        <div className="fixed w-full z-20">
          <Navbar />
        </div>

        {/* Scrollable Content */}
        <div className="pt-15 h-full overflow-y-auto ">{children}</div>
      </div>
    </div>
  );
};

export default CommonLayout;
