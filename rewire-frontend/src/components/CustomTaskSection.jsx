import { useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

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
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Extract the specific array of tasks for this section
  const tasks = activePlan?.[listType] || [];

  // 1. ADD TASK
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/plans/custom-task`,
        // `${API_URL}/plans/custom-task`,
        { listType, title: newTaskTitle },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setActivePlan(res.data);
      setNewTaskTitle("");
    } catch (error) {
      console.error(
        `Failed to add task to ${listType}:`,
        error.response?.data?.message || error.message,
      );
      alert(
        error.response?.data?.message || "Failed to add task. Max 10 allowed.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. TOGGLE STATUS (Pending <-> Completed)
  const handleToggleTask = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    try {
      const res = await axios.put(
        // `${API_URL}/plans/custom-task`,
        `${import.meta.env.VITE_API_URL}/plans/custom-task`,
        { listType, taskId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setActivePlan(res.data);

      // Trigger reward/confetti effect if marked as completed
      if (newStatus === "completed" && onTaskFinish) {
        onTaskFinish();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  // 3. DELETE TASK
  const handleDeleteTask = async (taskId) => {
    try {
      const res = await axios.delete(
        // `${API_URL}/plans/custom-task/${listType}/${taskId}`,
        `${import.meta.env.VITE_API_URL}/plans/custom-task/${listType}/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setActivePlan(res.data);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col transition-colors">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white leading-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-2 mt-4 mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new target..."
          className="flex-1 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
          disabled={isLoading || tasks.length >= 10}
        />
        <button
          type="submit"
          disabled={isLoading || tasks.length >= 10}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-xl flex items-center justify-center transition-colors"
        >
          <Plus size={18} />
        </button>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-48">
        {tasks.length === 0 ? (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 py-4 italic">
            No targets set yet.
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800 group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <input
                  type="checkbox"
                  checked={task.status === "completed"}
                  onChange={() => handleToggleTask(task._id, task.status)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer shrink-0"
                />
                <span
                  className={`text-sm truncate transition-colors ${
                    task.status === "completed"
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : "text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {task.title}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="text-gray-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1"
                title="Delete Task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomTaskSection;
