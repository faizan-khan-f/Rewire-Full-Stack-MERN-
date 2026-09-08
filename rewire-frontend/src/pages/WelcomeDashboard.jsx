import { Link } from "react-router-dom";

const WelcomeDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        Welcome Back to Neuro-Rewiring!
      </h1>
      <p className="text-center mb-12 text-gray-300">
        Choose a challenge to start or resume your progress.
      </p>

      {/* Three Plan Containers */}
      <div className="flex flex-col md:flex-row gap-8 justify-center max-w-6xl mx-auto">
        {/* Container 1 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-1 border border-gray-700 hover:border-blue-500 transition">
          <h2 className="text-2xl font-bold text-blue-400 mb-4">
            21-Day Challenge
          </h2>
          <p className="text-gray-400 mb-6">
            Start building foundational habits to rewire your daily routine.
          </p>
          <Link to="/challenge/21-day">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold">
              Select Plan
            </button>
          </Link>
        </div>

        {/* Container 2 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-1 border border-gray-700 hover:border-green-500 transition">
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            60-Day Challenge
          </h2>
          <p className="text-gray-400 mb-6">
            Deepen your focus and solidify permanent neural pathways.
          </p>
          <Link to="/challenge/60-day">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold">
              Select Plan
            </button>
          </Link>
        </div>

        {/* Container 3 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-1 border border-gray-700 hover:border-purple-500 transition">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">
            90-Day Challenge
          </h2>
          <p className="text-gray-400 mb-6">
            The ultimate cognitive reset for complete behavioral transformation.
          </p>
          <Link to="/challenge/90-day">
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold">
              Select Plan
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
