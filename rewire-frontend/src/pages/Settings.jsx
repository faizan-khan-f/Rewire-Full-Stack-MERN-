import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Settings as SettingsIcon, Save } from "lucide-react";
import axios from "axios";

const Settings = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // const API_URL = "http://localhost:5000/api/auth";
  const API_URL = `${import.meta.env.VITE_API_URL}/auth`;
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/profile`,
        { name, email },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const updatedUser = { ...res.data, token };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsError(false);
      setMessage("Profile updated successfully! Refreshing...");
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setIsError(true);
      setMessage(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in py-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl">
          <SettingsIcon size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Account Settings
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your profile details and preferences.
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-bold ${isError ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"}`}
        >
          {message}
        </div>
      )}

      {/* Edit Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          Personal Information
        </h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white text-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600 text-white font-bold rounded-xl flex items-center transition-transform active:scale-95 text-sm"
          >
            <Save size={18} className="mr-2" /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
