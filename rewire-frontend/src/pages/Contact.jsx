import { Mail, MessageSquare } from "lucide-react";

// Custom Instagram SVG logo component for full control over sizing and design
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Contact = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Get in Touch & Community
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Have feedback, feature suggestions, or want to share your
          transformation progress? Connect with our community channels or drop a
          direct message to the owner.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Instagram Community Card with Custom SVG Logo */}
        <a
          href="https://www.instagram.com/faizan_khan_f11/?utm_source=wa4a&utm_campaign=wa_vpl_m2_vf_web"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 transition-all group"
        >
          <div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <InstagramIcon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Instagram Community
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Follow our page for updates and daily motivation.
            </p>
          </div>
          <span className="inline-block mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Follow Page &rarr;
          </span>
        </a>

        {/* WhatsApp Community Card */}
        <a
          href="https://chat.whatsapp.com/LFIXBEsa6PBAUXtF9zwLFH"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 transition-all group"
        >
          <div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              WhatsApp Community
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Join our daily accountability group.
            </p>
          </div>
          <span className="inline-block mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Join Group &rarr;
          </span>
        </a>

        {/* Direct Email Card */}
        <a
          href="mailto:rewire.pvt@gmail.com?subject=Feedback and Suggestions"
          className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 transition-all group"
        >
          <div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Direct Email
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-all">
              rewire.pvt@gmail.com
            </p>
          </div>
          <span className="inline-block mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            Send Direct Feedback &rarr;
          </span>
        </a>
      </div>
    </div>
  );
};

export default Contact;
