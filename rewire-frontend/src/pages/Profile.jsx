import { useState, useEffect } from "react";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Trophy,
  Award,
  Activity,
  Star,
} from "lucide-react";
import axios from "axios";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // const API_URL = "http://localhost:5000/api/auth/profile";
  const API_URL = `${import.meta.env.VITE_API_URL}/auth/profile`;
  const token = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.token;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(res.data);
      } catch (error) {
        console.error("Failed to fetch profile");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-500">Loading profile...</div>
    );
  if (!profileData)
    return (
      <div className="text-center mt-20 text-red-500">
        Error loading profile data.
      </div>
    );

  const joinDate = new Date(profileData.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-gray-800 shadow-lg">
          <UserIcon size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {profileData.name}
        </h1>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center">
            <Mail size={16} className="mr-1" /> {profileData.email}
          </span>
          <span className="flex items-center">
            <Calendar size={16} className="mr-1" /> Joined {joinDate}
          </span>
        </div>
      </div>

      {/* The Trophy Cabinet */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-6">
          <Trophy size={24} className="text-emerald-500 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Trophy Cabinet
          </h2>
        </div>

        {profileData.completedChallenges.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <Star
              size={32}
              className="mx-auto text-gray-400 dark:text-gray-600 mb-3"
            />
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
              Your cabinet is empty
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Start a challenge from the dashboard to earn your first milestone.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profileData.completedChallenges.map((challenge, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl animate-scale-up"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-400 rounded-xl mr-3">
                  <Award size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 capitalize">
                    {challenge.replace(/-/g, " ")} Conquered
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-0.5">
                    Neuro-pathway successfully rebuilt.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Status */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center">
          <Activity size={20} className="text-blue-500 mr-3" />
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Current Active Focus
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {profileData.activePlan === "none"
                ? "Resting / No active challenge"
                : profileData.activePlan.replace(/-/g, " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
