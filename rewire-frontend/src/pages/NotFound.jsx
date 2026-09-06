import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 animate-fade-in">
      <div className="space-y-6 max-w-md">
        <h1 className="text-8xl font-extrabold text-emerald-600 dark:text-emerald-500 opacity-20">
          404
        </h1>

        <div className="space-y-2 text-center mt-[-3rem] relative z-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Lost in the void?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The page you are looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center px-6 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={18} className="mr-2" /> Go Back
          </button>

          <Link
            to="/"
            className="flex items-center px-6 py-3 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Home size={18} className="mr-2" /> Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
