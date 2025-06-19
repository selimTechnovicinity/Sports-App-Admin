"use client";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { CiTextAlignJustify } from "react-icons/ci";
import { FaClipboardQuestion } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { GiPlayerNext } from "react-icons/gi";
import { GrGroup } from "react-icons/gr";
import { IoSettings } from "react-icons/io5";
import { MdPrivacyTip, MdSportsBasketball } from "react-icons/md";
import { RiLogoutBoxRLine, RiUserSettingsLine } from "react-icons/ri";
import { SiNintendogamecube } from "react-icons/si";
import { TbEdit } from "react-icons/tb";
import { toast } from "react-toastify";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | undefined>();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setAccessToken(token);
  }, []);

  const isActive = (path: string) => pathname === path;

  // Handle logout
  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    toast.success("Logout Successful");
    router.push("/login");
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="p-2 m-2   text-white cursor-pointer rounded-full fixed z-40"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`flex flex-col bg-blue-950 text-white h-screen fixed z-25 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "210px" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4">
          <button onClick={toggleSidebar} className="lg:hidden">
            <FiMenu size={24} />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-grow mt-5 overflow-auto">
          <ul className="space-y-4 p-4">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/dashboard") ||
                  isActive("/dashboard/") ||
                  pathname.startsWith("/dashboard")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <BiSolidDashboard size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/users"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/users") ||
                  isActive("/users/") ||
                  pathname.startsWith("/users")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <RiUserSettingsLine size={20} />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                href="/season-types"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/season-types") ||
                  isActive("/season-types/") ||
                  pathname.startsWith("/season-types")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <SiNintendogamecube size={20} />
                <span>Season Types</span>
              </Link>
            </li>
            <li>
              <Link
                href="/age-types"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/age-types") ||
                  isActive("/age-types/") ||
                  pathname.startsWith("/age-types")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <GiPlayerNext size={20} />
                <span>Age Types</span>
              </Link>
            </li>
            <li>
              <Link
                href="/game-types"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/game-types") ||
                  isActive("/game-types/") ||
                  pathname.startsWith("/game-types")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <MdSportsBasketball size={20} />
                <span>Game Types</span>
              </Link>
            </li>
            <li>
              <Link
                href="/team-types"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/team-types") ||
                  isActive("/team-types/") ||
                  pathname.startsWith("/team-types")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <GrGroup size={20} />
                <span>Team Types</span>
              </Link>
            </li>
            <li>
              <Link
                href="/teams"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/teams") ||
                  isActive("/teams/") ||
                  pathname.startsWith("/teams")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <GrGroup size={20} />
                <span>Teams</span>
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/events") ||
                  isActive("/events/") ||
                  pathname.startsWith("/events")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <GrGroup size={20} />
                <span>Events</span>
              </Link>
            </li>

            {/* <li>
              <Link
                href="/users"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/users") ||
                  isActive("/users/") ||
                  pathname.startsWith("/users")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <FiUser size={20} />
                <span>Users</span>
              </Link>
            </li> */}
            <li>
              <Link
                href="/admin-profile"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/admin-profile")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <TbEdit size={20} />
                <span>Admin Profile</span>
              </Link>
            </li>
            {/* <li>
              <Link
                href="/update-password"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/update-password")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <TbPasswordUser size={20} />
                <span>Update Admin Password</span>
              </Link>
            </li> */}

            <li>
              <Link
                href="/faq"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/faq") ||
                  isActive("/faq/") ||
                  pathname.startsWith("/faq")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <FaClipboardQuestion size={20} />
                <span>FAQ</span>
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/privacy") ||
                  isActive("/privacy/") ||
                  pathname.startsWith("/privacy")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <MdPrivacyTip size={20} />
                <span>Privacy & Policy</span>
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/terms") ||
                  isActive("/terms/") ||
                  pathname.startsWith("/terms")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <CiTextAlignJustify size={20} />
                <span>Terms & Conditions</span>
              </Link>
            </li>
            {/* <li>
              <Link
                href="/messages"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/messages") ||
                  isActive("/messages/") ||
                  pathname.startsWith("/messages")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <BsEnvelopeOpenHeart size={20} />
                <span>Messages</span>
              </Link>
            </li> */}

            <li>
              <Link
                href="/settings"
                className={`flex items-center gap-3 p-2 rounded ${
                  isActive("/settings") ||
                  isActive("/settings/") ||
                  pathname.startsWith("/settings")
                    ? "bg-blue-700"
                    : "hover:bg-blue-700"
                }`}
              >
                <IoSettings size={20} />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <>
                {accessToken ? (
                  <button
                    className="flex w-full items-center gap-3 p-2 rounded cursor-pointer hover:bg-blue-700"
                    onClick={handleLogout}
                  >
                    <RiLogoutBoxRLine />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link href="/login">
                    <button className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-blue-700">
                      Login
                    </button>
                  </Link>
                )}
              </>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
