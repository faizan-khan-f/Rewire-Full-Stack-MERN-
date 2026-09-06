import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
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

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Side: Logo & Main Links */}
          <div className="flex items-center space-x-8">
            <Link
              to={user ? "/dashboard" : "/"}
              className="text-xl font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors"
            >
              Rewire.
            </Link>

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
                  <CheckSquare size={18} className="mr-1 text-emerald-300" />{" "}
                  To-Do
                </a>
              )}
            </div>
          </div>

          {/* Right Side: Community, Theme Toggle, & User Info */}
          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
            {/* Community Links */}
            <a
              href="https://chat.whatsapp.com/LFIXBEsa6PBAUXtF9zwLFH"
              target="_blank"
              rel="noreferrer"
              title="WhatsApp Community"
              className="hover:text-emerald-500 transition-colors"
            >
              <MessageSquare size={20} />
            </a>
            {/* <a */}
            {/* href="https://instagram.com/YOUR_PROFILE_HERE" */}
            {/* target="_blank" */}
            {/* rel="noreferrer" */}
            {/* title="Instagram Community" */}
            {/* className="hover:text-emerald-500 transition-colors" */}
            {/* / > */}
            {/* <Instagram size={20} /> */}
            {/* </a> */}

            {/* Feedback Email Link */}
            {/* <p>Feel free to reach</p> */}
            <a
              href="mailto:rewire.pvt@gmail.com?subject=Feedback and Suggestions"
              title="Send Feedback"
              className="text-sm font-medium hover:text-emerald-500 transition-colors hidden sm:block"
            >
              Feedback/Suggestions
            </a>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Auth Section */}
            {/* {user ? (
              <div className="flex items-center space-x-3 ml-2">
                <Link
                  to="/profile"
                  className="flex items-center text-sm font-medium hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors hidden sm:flex"
                >
                  <User size={16} className="mr-1" />
                  Hi, {user.name.split(" ")[0]}
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : ( */}
            {/* User Profile / Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4 ml-2">
                <Link
                  to="/profile"
                  className="flex items-center text-sm font-medium hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors hidden sm:flex"
                >
                  <User size={16} className="mr-1" />
                  Hi, {user?.name?.split(" ")[0]}
                </Link>

                {/* NEW SETTINGS GEAR */}
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
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
