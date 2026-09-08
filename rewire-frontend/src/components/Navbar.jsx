import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import {
  Sun,
  Moon,
  CheckSquare,
  MessageSquare,
  LogOut,
  User,
  Settings,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // 1. State to manage whether the mobile dropdown is open or closed
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to easily close the mobile menu after a link is clicked
  const closeMenu = () => setIsMobileMenuOpen(false);

  // Wrapper for logout to close menu as well
  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className="top-0 z-50 relative bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* ========================================= */}
          {/* LEFT SIDE: Logo & Desktop Main Links      */}
          {/* ========================================= */}
          <div className="flex items-center space-x-8">
            <Link
              to={user ? "/dashboard" : "/"}
              className="text-xl font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors"
            >
              Rewire.
            </Link>

            {/* Desktop-only Navigation Links */}
            <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              <Link
                to="/about"
                className="hover:text-emerald-500 transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="hover:text-emerald-500 transition-colors"
              >
                Contact Us
              </Link>
              {user && (
                <a
                  href="https://task-manager-s5f2.onrender.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center hover:text-emerald-500 transition-colors"
                >
                  <CheckSquare size={18} className="mr-1 text-emerald-300" />
                  To-Do
                </a>
              )}
            </div>
          </div>

          {/* ========================================= */}
          {/* RIGHT SIDE: To-Do, Theme, Auth, Menu      */}
          {/* ========================================= */}
          <div className="flex items-center space-x-3 md:space-x-4 text-gray-600 dark:text-gray-300">
            {/* Desktop Only: Community & Feedback Links */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="https://chat.whatsapp.com/LFIXBEsa6PBAUXtF9zwLFH"
                target="_blank"
                rel="noreferrer"
                title="WhatsApp Community"
                className="hover:text-emerald-500 transition-colors"
              >
                <MessageSquare size={20} />
              </a>
              <a
                href="mailto:rewire.pvt@gmail.com?subject=Feedback and Suggestions"
                title="Send Feedback"
                className="text-sm font-medium hover:text-emerald-500 transition-colors"
              >
                Feedback/Suggestions
              </a>
              {/* Vertical Divider (Desktop Only) */}
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
            </div>

            {/* Mobile Only: To-Do Icon (Rightmost side before theme/menu) */}
            {user && (
              <a
                href="https://task-manager-s5f2.onrender.com"
                target="_blank"
                rel="noreferrer"
                className="md:hidden text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors"
                title="To-Do List"
              >
                <CheckSquare size={22} />
              </a>
            )}

            {/* Theme Toggle Button (Visible on both) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Desktop Only: User Auth Section */}
            <div className="hidden md:flex items-center space-x-4 ml-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center text-sm font-medium hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  >
                    <User size={16} className="mr-1" />
                    Hi, {user?.name?.split(" ")[0]}
                  </Link>

                  <Link
                    to="/settings"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <Settings size={20} />
                  </Link>

                  <button
                    onClick={logout}
                    className="flex items-center text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Only: Hamburger Button / Dropdown Container */}
            <div className="md:hidden flex items-center relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 dark:text-gray-300 hover:text-emerald-500 focus:outline-none p-1"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {/* ========================================= */}
              {/* MOBILE STICKY DROPDOWN MENU               */}
              {/* ========================================= */}
              {isMobileMenuOpen && (
                <div className="absolute top-full right-0 w-52 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl rounded-xl flex flex-col p-5 z-50 transition-colors duration-300 mt-2">
                  {/* Top: Profile Section */}
                  {user && (
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-5 mb-2">
                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-100 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
                      >
                        <User size={16} className="mr-2 text-emerald-500" />
                        Profile
                      </Link>
                    </div>
                  )}

                  {/* Middle: Standard Links & Settings */}
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/about"
                      onClick={closeMenu}
                      className="text-sm pb-3 font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/contact"
                      onClick={closeMenu}
                      className="text-sm pb-3 font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
                    >
                      Contact Us
                    </Link>
                    {user && (
                      <Link
                        to="/settings"
                        onClick={closeMenu}
                        className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
                      >
                        <Settings size={16} className="mr-2 text-gray-400" />
                        Settings
                      </Link>
                    )}
                  </div>

                  {/* Bottom: Logout / Login (Pushed down slightly with balanced spacing) */}
                  <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2">
                    {user ? (
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full mt-3 text-sm font-medium text-red-500 hover:text-red-600 transition pt-0.5"
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="flex justify-center w-full px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition mt-0.5"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
