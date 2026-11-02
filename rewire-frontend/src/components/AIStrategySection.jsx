// import { Brain, Sparkles, Target, Activity } from "lucide-react";
import { Brain, Bot, Target, Activity } from "lucide-react"; // 🟢 Swap Sparkles for Bot
// 🟢 Add the axios import here
import axios from "axios";

// 🟢 Add setAiPlan, token, and API_URL to the props list
const AIStrategySection = ({ aiPlan, setAiPlan, token, API_URL }) => {
  if (!aiPlan) return null;

  const { intakeData, aiStrategy } = aiPlan;

  // const handleToggleTask = async (taskId, taskType) => {
  //   try {
  //     const res = await axios.patch(
  //       `${API_URL}/ai/plan/task`,
  //       { taskId, taskType },
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );
  //     setAiPlan(res.data);
  //   } catch (err) {
  //     console.error("Failed to update task status:", err);
  //   }
  // };
  // const handleToggleTask = async (taskId, taskType) => {
  //   try {
  //     // 🟢 Fix: Provide a hardcoded fallback just in case the environment variable fails to load
  //     const baseUrl =
  //       API_URL && API_URL !== "undefined"
  //         ? API_URL
  //         : "http://localhost:5000/api";

  //     const res = await axios.patch(
  //       `${baseUrl}/ai/plan/task`,
  //       { taskId, taskType },
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );
  //     setAiPlan(res.data);
  //   } catch (err) {
  //     console.error("Failed to update task status:", err);
  //   }
  // };
  // const handleToggleTask = async (taskId, taskType) => {
  //   try {
  //     // 🟢 Fix: Use the absolute URL to bypass the misaligned API_URL variable
  //     const res = await axios.patch(
  //       // "http://localhost:5000/api/ai/plan/task",
  //       `${API_URL}/ai/plan/task`, //for production
  //       { taskId, taskType },
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );
  //     setAiPlan(res.data);
  //   } catch (err) {
  //     console.error("Failed to update task status:", err);
  //   }
  // };
  const handleToggleTask = async (taskId, taskType) => {
    try {
      // 🟢 Sanitize the URL by removing the extra '/plans' if it exists
      const cleanApiUrl = API_URL
        ? API_URL.replace("/plans", "")
        : "http://localhost:5000/api";

      const res = await axios.patch(
        `${cleanApiUrl}/ai/plan/task`,
        { taskId, taskType },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAiPlan(res.data);
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 md:p-8 rounded-3xl border border-gray-700 shadow-2xl mb-8">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-900/50 text-emerald-400 rounded-xl">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Neuro-Protocol Active
            </h2>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-1">
              Focus: {intakeData?.primaryFocus} • {intakeData?.durationDays}{" "}
              Days
            </p>
          </div>
        </div>
      </div> */}
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div className="flex items-center space-x-4">
          {/* Spidey Animated Avatar */}
          <div className="relative p-3 bg-emerald-900/40 border border-emerald-700/50 text-emerald-400 rounded-2xl shadow-lg">
            {/* Online Indicator Ping */}
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            {/* Avatar Pulse */}
            <Bot size={28} className="animate-pulse" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              Spidey's Master Plan
            </h2>
            <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mt-1">
              Focus: {intakeData?.primaryFocus} • {intakeData?.durationDays}{" "}
              Days
            </p>
          </div>
        </div>
      </div>

      {/* Core Philosophy & Reframes */}
      <div className="mb-8 bg-gray-800/50 p-5 rounded-2xl border border-gray-700">
        <h3 className="text-sm font-bold text-gray-300 flex items-center mb-3">
          <Brain size={16} className="mr-2 text-emerald-500" />
          Clinical Strategy
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed mb-4 italic">
          "{aiStrategy?.corePhilosophy}"
        </p>
        <div className="space-y-2">
          {aiStrategy?.cognitiveReframes?.map((reframe, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-2 text-sm text-gray-300"
            >
              <span className="text-emerald-500 font-bold">→</span>
              <span>{reframe}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Routines Grid
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Daily Tasks */}
      {/* <div className="bg-gray-800/80 p-5 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center mb-4">
            <Activity size={16} className="mr-2" /> Daily Protocol
          </h3>
          <div className="space-y-3">
            {dailyRoutines?.map((task) => (
              <div
                key={task._id || task.title}
                className="bg-gray-900/50 p-3 rounded-xl border border-gray-700"
              >
                <p className="text-sm font-bold text-gray-200">{task.title}</p>
                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
              </div>
            ))}
          </div>
        // </div> */}

      {/* Weekly Milestones */}
      {/* <div className="bg-gray-800/80 p-5 rounded-2xl border border-gray-700">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center mb-4">
            <Target size={16} className="mr-2" /> Weekly Milestones
          </h3>
          <div className="space-y-3">
            {weeklyMilestones?.map((task) => (
              <div
                key={task._id || task.title}
                className="bg-gray-900/50 p-3 rounded-xl border border-gray-700"
              >
                <p className="text-sm font-bold text-gray-200">{task.title}</p>
                <p className="text-xs text-gray-500 mt-1">{task.description}</p>
              </div> */}
      {/* ))}
          </div> */}
      {/* </div> */}
      {/* </div> */}
      {/* Daily Tasks */}
      {aiPlan.dailyRoutines && aiPlan.dailyRoutines.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">Daily Routines</h3>
          <div className="space-y-3">
            {aiPlan.dailyRoutines.map((task) => {
              const isCompleted = task.status === "completed";

              return (
                <label
                  key={task._id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors ${isCompleted ? "bg-gray-800/50 border-gray-700" : "bg-gray-800 border-gray-600 hover:bg-gray-750"}`}
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleToggleTask(task._id, "daily")}
                    className="w-5 h-5 rounded border-gray-500 text-emerald-500 focus:ring-emerald-500 bg-gray-700 cursor-pointer"
                  />
                  <span
                    className={`text-lg transition-all ${isCompleted ? "text-gray-500 line-through" : "text-gray-200"}`}
                  >
                    {task.title}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly Milestones */}
      {aiPlan.weeklyMilestones && aiPlan.weeklyMilestones.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">
            Weekly Milestones
          </h3>
          <div className="space-y-3">
            {aiPlan.weeklyMilestones.map((task) => {
              const isCompleted = task.status === "completed";

              return (
                <label
                  key={task._id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer transition-colors ${isCompleted ? "bg-gray-800/50 border-gray-700" : "bg-gray-800 border-gray-600 hover:bg-gray-750"}`}
                >
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => handleToggleTask(task._id, "weekly")}
                    className="w-5 h-5 rounded border-gray-500 text-emerald-500 focus:ring-emerald-500 bg-gray-700 cursor-pointer"
                  />
                  <span
                    className={`text-lg transition-all ${isCompleted ? "text-gray-500 line-through" : "text-gray-200"}`}
                  >
                    {task.title}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStrategySection;
