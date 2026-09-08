import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Brain,
  Activity,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  Circle,
  Sparkles,
  Trophy,
  Trash2,
  Plus,
  Target,
  CalendarDays,
  Flag,
  FileText,
} from "lucide-react";
import axios from "axios";
import confetti from "canvas-confetti";

// --- SYNTHESIZED SOUND ENGINE (Multi-Note Chimes & Clicks) ---
const playClick = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {}
};

const playTaskPop = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
};

const playCelebrationChime = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();

    const notes = [659.25, 880.0, 1108.73, 1318.51];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.09);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + index * 0.09);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + index * 0.09 + 0.4,
      );

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.09);
      osc.stop(ctx.currentTime + index * 0.09 + 0.4);
    });
  } catch (e) {}
};

const triggerSmallConfetti = () => {
  confetti({
    particleCount: 40,
    spread: 50,
    origin: { y: 0.8 },
    colors: ["#10B981", "#34D399", "#059669"],
  });
};

const triggerVictoryConfetti = () => {
  const duration = 3500;
  const end = Date.now() + duration;
  const frame = () => {
    confetti({
      particleCount: 10,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors: ["#10B981", "#FBBF24", "#8B5CF6"],
    });
    confetti({
      particleCount: 10,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors: ["#10B981", "#FBBF24", "#8B5CF6"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
};

// --- REUSABLE COMPONENT FOR CUSTOM SECTIONS ---
const CustomTaskSection = ({
  title,
  description,
  icon: Icon,
  listType,
  activePlan,
  token,
  API_URL,
  setActivePlan,
  onTaskFinish,
}) => {
  const [newTask, setNewTask] = useState("");
  const tasks = activePlan[listType] || [];
  const limitReached = tasks.length >= 10;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || limitReached) return;
    try {
      const res = await axios.post(
        `${API_URL}/custom-task`,
        { listType, title: newTask },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setActivePlan(res.data);
      setNewTask("");
    } catch (error) {
      alert("Failed to add task.");
    }
  };

  const handleUpdate = async (taskId, status) => {
    try {
      const res = await axios.put(
        `${API_URL}/custom-task`,
        { listType, taskId, status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setActivePlan(res.data);
      if (status === "finished" && onTaskFinish) onTaskFinish();
    } catch (error) {
      console.error("Failed to update status.");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const res = await axios.delete(
        `${API_URL}/custom-task/${listType}/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setActivePlan(res.data);
    } catch (error) {
      console.error("Failed to delete task.");
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg mr-3">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
              {title}{" "}
              <span className="ml-2 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                {tasks.length}/10 Max
              </span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={
            limitReached ? "Max limit reached" : "Add a custom goal..."
          }
          disabled={limitReached}
          maxLength={100}
          className="flex-grow px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white text-sm disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={limitReached || !newTask.trim()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:dark:bg-gray-700 text-white font-bold rounded-xl transition-transform active:scale-95"
        >
          <Plus size={18} />
        </button>
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded-xl transition-all group"
          >
            <div
              className="flex items-center cursor-pointer flex-grow"
              onClick={() =>
                handleUpdate(
                  task._id,
                  task.status === "pending" ? "finished" : "pending",
                )
              }
            >
              <div
                className={`mr-3 p-0.5 rounded-full border-2 transition-colors ${task.status === "finished" ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 dark:border-gray-600"}`}
              >
                {task.status === "finished" ? (
                  <CheckCircle size={14} />
                ) : (
                  <Circle size={14} className="text-transparent" />
                )}
              </div>
              <span
                className={`text-sm font-medium transition-colors ${task.status === "finished" ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-200"}`}
              >
                {task.title}
              </span>
            </div>
            <button
              onClick={() => handleDelete(task._id)}
              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const { user } = useAuth();
  const [activePlan, setActivePlan] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_URL = `${import.meta.env.VITE_API_URL}/plans`;
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // Global Click Sound Listener
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.closest("button, a, .cursor-pointer")) {
        playClick();
      }
    };
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await axios.get(`${API_URL}/myplan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivePlan(res.data);
        setShowTracker(true);
      } catch (error) {}
      setLoading(false);
    };
    fetchPlan();
  }, [token]);

  const handleStartPlan = async (planType) => {
    try {
      const res = await axios.post(
        `${API_URL}/start`,
        { planType },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.status === 201) {
        setActivePlan(res.data);
        setShowTracker(true);
      }
    } catch (error) {
      alert("Failed to start plan");
    }
  };

  const updateTask = async (taskId, status) => {
    try {
      const res = await axios.put(
        `${API_URL}/task`,
        { planId: activePlan._id, taskId, status },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (status === "finished") {
        const updatedTaskObj = res.data.tasks.find((t) => t._id === taskId);

        if (updatedTaskObj) {
          const targetDay = updatedTaskObj.dayNumber;
          const dayTasksNow = res.data.tasks.filter(
            (t) => t.dayNumber === targetDay,
          );
          const dayTasksBefore = activePlan.tasks.filter(
            (t) => t.dayNumber === targetDay,
          );

          const isDayNowComplete =
            dayTasksNow.length > 0 &&
            dayTasksNow.every((t) => t.status === "finished");
          const wasDayAlreadyComplete =
            dayTasksBefore.length > 0 &&
            dayTasksBefore.every((t) => t.status === "finished");

          const totalMaxDays =
            activePlan.tasks[activePlan.tasks.length - 1]?.dayNumber || 0;
          const isWeeklyMilestone = targetDay % 7 === 0;
          const is21DayMilestone = targetDay === 21;
          const isFinalDay = targetDay === totalMaxDays;
          const isDay1 = targetDay === 1;

          if (
            isDayNowComplete &&
            !wasDayAlreadyComplete &&
            (isDay1 || isWeeklyMilestone || is21DayMilestone || isFinalDay)
          ) {
            // Milestone celebration (Day 1, End of Week 7/14/etc., 21 Days, or Final Day)
            playCelebrationChime();
            triggerVictoryConfetti();
          } else {
            playTaskPop();
            triggerSmallConfetti();
          }
        } else {
          playTaskPop();
          triggerSmallConfetti();
        }
      }

      setActivePlan(res.data);
    } catch (error) {
      console.error("Failed to update task");
    }
  };

  const handleCustomReward = () => {
    playTaskPop();
    triggerSmallConfetti();
  };

  const handleCancelPlan = async () => {
    if (window.confirm("Abandon this challenge? All progress will be lost.")) {
      try {
        await axios.delete(`${API_URL}/cancel`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivePlan(null);
        setShowTracker(false);
      } catch (error) {
        alert("Failed to cancel plan.");
      }
    }
  };

  const handleCompletePlan = async () => {
    try {
      await axios.post(
        `${API_URL}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const currentUserData = JSON.parse(localStorage.getItem("user"));
      if (currentUserData) {
        currentUserData.activePlan = "none";
        localStorage.setItem("user", JSON.stringify(currentUserData));
      }

      playCelebrationChime();
      triggerVictoryConfetti();

      setTimeout(() => {
        setActivePlan(null);
        setShowTracker(false);
      }, 3500);
    } catch (error) {
      alert("Failed to archive plan.");
    }
  };

  // 5. State Handling inside Dashboard component
  // Ensure you declare state variables for the plan note inside the active plan tracker view:

  const [showPlanNoteDropdown, setShowPlanNoteDropdown] = useState(false);
  const [planNoteText, setPlanNoteText] = useState(activePlan?.planNote || "");

  useEffect(() => {
    if (activePlan) {
      setPlanNoteText(activePlan.planNote || "");
    }
  }, [activePlan]);

  const handleSavePlanNote = async () => {
    try {
      const res = await axios.put(
        `${API_URL}/plan-note`,
        { note: planNoteText },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setActivePlan(res.data);
      setShowPlanNoteDropdown(false);
    } catch (error) {
      alert("Failed to save plan note.");
    }
  };

  if (showTracker && activePlan && !loading) {
    const dayDiff =
      Math.floor(
        (new Date() - new Date(activePlan.startDate)) / (1000 * 60 * 60 * 24),
      ) + 1;
    const todaysTasks = activePlan.tasks.filter((t) => t.dayNumber === dayDiff);
    const totalTasks = activePlan.tasks.length;
    const finishedTasks = activePlan.tasks.filter(
      (t) => t.status === "finished",
    ).length;
    const progressPercentage =
      totalTasks > 0 ? Math.round((finishedTasks / totalTasks) * 100) : 0;
    const isPlanComplete = totalTasks > 0 && finishedTasks === totalTasks;

    const day1Tasks = activePlan.tasks.filter((t) => t.dayNumber === 1);
    const isDay1Complete =
      day1Tasks.length > 0 && day1Tasks.every((t) => t.status === "finished");
    const showDay1Congrats = dayDiff === 1 && isDay1Complete && !isPlanComplete;

    const pt = activePlan.planType;
    const show21Day =
      pt === "reset-and-rewire" || pt === "reset-rewire-and-rebounce";
    const show90Day = pt === "reset-rewire-and-rebounce";

    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Navigation Bar */}
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowTracker(false)}
            className="flex items-center text-sm font-bold text-gray-200 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} className=" mr-1" /> Back to Dashboard
          </button>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full uppercase tracking-wider flex items-center">
            <Activity size={14} className="mr-1" /> Active Focus
          </span>
        </div>
        {/* Milestone Banner */}
        {(showDay1Congrats || isPlanComplete) && (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start animate-scale-up shadow-sm">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-xl mr-4 flex-shrink-0">
              <Trophy size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                {isPlanComplete
                  ? "Challenge Completed!"
                  : "First Step Conquered!"}
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                {isPlanComplete
                  ? "You have successfully restored your dopamine baseline. Incredible work."
                  : "Congrats! You took the first step towards a better life today. Prepare for tomorrow."}
              </p>
            </div>
          </div>
        )}
        {/* Progress Header */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Day{" "}
                {dayDiff >
                activePlan.tasks[activePlan.tasks.length - 1]?.dayNumber
                  ? "Completed"
                  : dayDiff}{" "}
                of your {pt.replace(/-/g, " ")} Challenge
              </h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {progressPercentage}%
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        {/* Today's Core Protocol */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Zap size={20} className="mr-2 text-emerald-500" /> Everydays's Core
            Protocol
          </h3>
          <div className="space-y-3 mb-6">
            {todaysTasks.length > 0 ? (
              todaysTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl"
                >
                  <span
                    className={`text-sm font-medium ${task.status === "finished" ? "text-gray-400 line-through" : "text-gray-800 dark:text-gray-200"}`}
                  >
                    {task.title}
                  </span>
                  <div className="flex space-x-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => updateTask(task._id, "pending")}
                      className={`p-2 rounded-lg text-xs font-bold cursor-pointer ${task.status === "pending" ? "bg-gray-200 dark:bg-gray-700" : "text-gray-400 hover:bg-gray-100"}`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => updateTask(task._id, "in-progress")}
                      className={`p-2 rounded-lg text-xs font-bold cursor-pointer ${task.status === "in-progress" ? "bg-amber-100 text-amber-700" : "text-gray-400 hover:bg-gray-100"}`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateTask(task._id, "finished")}
                      className={`p-2 rounded-lg text-xs font-bold flex items-center cursor-pointer ${task.status === "finished" ? "bg-emerald-100 text-emerald-700" : "text-gray-400 hover:bg-gray-100"}`}
                    >
                      <CheckCircle size={14} className="mr-1" /> Finished
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No core tasks today. Keep sustaining your baseline!
              </p>
            )}
          </div>
        </div>
        {/* --- CUSTOM TARGETS SECTION --- */}
        {/* <div className="flex items-center space-x-2 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <Target
            size={24}
            className="text-emerald-600 dark:text-emerald-400"
          />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Your Personal Targets
          </h2>
        </div> */}
        {/* // 4. Frontend Dashboard Update: src/pages/Dashboard.jsx // Replace the */}
        {/* "Your Personal Targets" header section inside your tracker view with */}
        {/* this layout featuring the Gemini-style note selector popover: */}
        {/* --- CUSTOM TARGETS SECTION WITH GEMINI-STYLE NOTE POPOVER ON THE RIGHT OPPOSITE SIDE --- */}
        <div className="flex items-center justify-between pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 relative">
          <div className="flex items-center space-x-2">
            <Target
              size={24}
              className="text-emerald-600 dark:text-emerald-400"
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Personal Targets
            </h2>
          </div>

          {/* Gemini-Style Model Selector Popover for Plan Note */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPlanNoteDropdown(!showPlanNoteDropdown)}
              className={`px-4 py-2 rounded-2xl border transition-all cursor-pointer flex items-center space-x-2 text-xs font-bold shadow-sm ${
                activePlan.planNote?.trim()
                  ? "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-500"
              }`}
            >
              <FileText size={14} className="text-emerald-500" />
              <span>
                {activePlan.planNote?.trim()
                  ? "Plan Note Active"
                  : "Add Plan Note"}
              </span>
            </button>

            {showPlanNoteDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-5 z-50 animate-scale-up">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center">
                    <Sparkles size={12} className="mr-1" /> Plan Strategy &
                    Notes
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPlanNoteDropdown(false)}
                    className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <textarea
                  rows={5}
                  value={planNoteText}
                  onChange={(e) => setPlanNoteText(e.target.value)}
                  placeholder="Record your master strategy, rules, or long-term mindset for this entire challenge..."
                  className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none mb-3 shadow-inner"
                />
                <button
                  type="button"
                  onClick={handleSavePlanNote}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-transform active:scale-95 cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  Save Master Note
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomTaskSection
            title="Today's Do's & Don'ts"
            description="Daily personal habits to track."
            icon={Activity}
            listType="customDaily"
            activePlan={activePlan}
            token={token}
            API_URL={API_URL}
            setActivePlan={setActivePlan}
            onTaskFinish={handleCustomReward}
          />
          <CustomTaskSection
            title="Weekly Targets"
            description="Goals for this week."
            icon={CalendarDays}
            listType="customWeekly"
            activePlan={activePlan}
            token={token}
            API_URL={API_URL}
            setActivePlan={setActivePlan}
            onTaskFinish={handleCustomReward}
          />
          {show21Day && (
            <CustomTaskSection
              title="21-Day Goals"
              description="Mid-term personal targets."
              icon={Brain}
              listType="custom21Day"
              activePlan={activePlan}
              token={token}
              API_URL={API_URL}
              setActivePlan={setActivePlan}
              onTaskFinish={handleCustomReward}
            />
          )}
          {show90Day && (
            <>
              <CustomTaskSection
                title="Monthly Goals"
                description="Short-term milestone goals."
                icon={Flag}
                listType="customMonthly"
                activePlan={activePlan}
                token={token}
                API_URL={API_URL}
                setActivePlan={setActivePlan}
                onTaskFinish={handleCustomReward}
              />
              <CustomTaskSection
                title="90-Day Long Term"
                description="Ultimate neuro-rewire targets."
                icon={Trophy}
                listType="custom90Day"
                activePlan={activePlan}
                token={token}
                API_URL={API_URL}
                setActivePlan={setActivePlan}
                onTaskFinish={handleCustomReward}
              />
            </>
          )}
        </div>
        <div className="flex justify-between items-center pt-8 mt-6">
          {isPlanComplete ? (
            <button
              onClick={handleCompletePlan}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center shadow-lg transform transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Trophy size={18} className="mr-2" /> Claim Victory & Archive
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={handleCancelPlan}
            className="text-xs font-bold text-red-500 hover:text-red-700 border-b border-transparent hover:border-current pb-0.5 cursor-pointer"
          >
            Broke the fast? Reset Journey
          </button>
        </div>
      </div>
    );
  }

  const grids = [
    {
      id: "reset",
      title: "Reset",
      duration: "1 Week",
      icon: <Activity className="text-blue-500 w-8 h-8" />,
      features: [
        "Practice mindfulness",
        "Move your body & sleep better",
        "Data fasting",
        "Set boundaries",
        "Do less rewarding tasks",
      ],
    },
    {
      id: "reset-and-rewire",
      title: "Reset & Rewire",
      duration: "21 Days",
      icon: <Brain className="text-emerald-500 w-8 h-8" />,
      features: [
        "Identify & break habit loops",
        "Substitute doomscrolling with creation",
        "Breathing drills",
        "Sustain 1-Week Reset baseline",
      ],
    },
    {
      id: "reset-rewire-and-rebounce",
      title: "Reset, Rewire & Rebounce",
      duration: "90 Days",
      icon: <Zap className="text-purple-500 w-8 h-8" />,
      features: [
        "Review custom short/long-term goals",
        "Execute 90-min deep work",
        "Maintain digital boundaries",
        "Sustain 21-Day habits",
      ],
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {activePlan
            ? "You have an ongoing challenge. Stay focused!"
            : "Select a section below to begin your journey."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {grids.map((grid) => {
          const isThisPlanActive = activePlan?.planType === grid.id;
          const hasAnyActivePlan = activePlan !== null;

          return (
            <div
              key={grid.id}
              className={`flex flex-col p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 transition-all ${isThisPlanActive ? "border-emerald-500" : "border-transparent hover:border-gray-300"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {grid.icon}
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${isThisPlanActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-800"}`}
                >
                  {isThisPlanActive ? "Current Focus" : grid.duration}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">
                {grid.title}
              </h3>
              <ul className="space-y-2 mb-8 flex-grow">
                {grid.features.map((feat, i) => (
                  <li
                    key={i}
                    className={`flex text-sm ${hasAnyActivePlan && !isThisPlanActive ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 flex-shrink-0 ${hasAnyActivePlan && !isThisPlanActive ? "bg-gray-300" : "bg-emerald-500"}`}
                    />{" "}
                    {feat}
                  </li>
                ))}
              </ul>

              {isThisPlanActive ? (
                <button
                  onClick={() => setShowTracker(true)}
                  className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl flex justify-center items-center shadow-lg active:scale-95 cursor-pointer"
                >
                  Resume Challenge <ArrowRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => handleStartPlan(grid.id)}
                  disabled={hasAnyActivePlan}
                  className={`w-full py-3 font-bold rounded-xl flex justify-center items-center cursor-pointer ${hasAnyActivePlan ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95"}`}
                >
                  {hasAnyActivePlan ? (
                    <span>Plan in Progress</span>
                  ) : (
                    <>
                      <Zap size={16} className="mr-2" /> Start Challenge
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
