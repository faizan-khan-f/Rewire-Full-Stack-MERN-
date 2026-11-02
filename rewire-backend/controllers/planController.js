import Plan from "../models/Plan.js";
import User from "../models/User.js";

// @desc    Start Challenge & Generate Tasks
export const startPlan = async (req, res) => {
  try {
    const { planType } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (user.activePlan !== "none") {
      return res
        .status(400)
        .json({ message: "You already have an active challenge." });
    }

    let generatedTasks = [];

    // --- CONTAINER 1: RESET (Days 1-7) Applied to ALL plans ---
    const resetHabits = [
      "Practice Mindfulness 😮‍💨[Meditate ,Pray,Just sit for 10 mins]",
      "Data Fasting [No internet, Doom scrolling]",
      "Move your body 🚶‍♂️‍➡️[Take a walk,Run ,Do physical works]",
      "Set boundaries [No overstimulation & emotional overload develope will power,Decision Making]",
      "Do less rewarding tasks [Make your bed,Clean your room,Dopamine baseline reset]",
      "Sleep better 😴[Minimum 7 hr]",
    ];

    const rewireHabits = [
      "Review and Journal custom short-term and long-term life targets and goals",
      "Execute tasks, JUST DO IT! 😡",
      "Reward youself before going to bed take that hit you deserve it",
    ];

    const rebounceHabits = [
      "Prioritize gratitude, yourself ,love and peace for happiness and goals everyday 💕",
    ];

    // 2. Stack the habits based on the chosen plan
    let duration = 7;
    let activeHabits = [...resetHabits]; // Default to just Container 1

    if (planType === "reset-and-rewire") {
      duration = 21;
      // Combine Container 1 + 2 from Day 1
      activeHabits = [...resetHabits, ...rewireHabits];
    } else if (planType === "reset-rewire-and-rebounce") {
      duration = 90;
      // Combine Container 1 + 2 + 3 from Day 1
      activeHabits = [...resetHabits, ...rewireHabits, ...rebounceHabits];
    }

    // 3. Generate the tasks for every single day of the challenge
    for (let day = 1; day <= duration; day++) {
      activeHabits.forEach((habit) => {
        generatedTasks.push({ title: habit, dayNumber: day });
      });
    }

    const newPlan = await Plan.create({
      user: userId,
      planType,
      tasks: generatedTasks,
    });

    // 🚨 FIX: Update the User's active plan status in the database
    user.activePlan = planType;
    user.planStartDate = new Date();
    await user.save();
    //
    res.status(201).json(newPlan);
  } catch (error) {
    console.error("CRITICAL PLAN START ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// // @desc    Get user's active plan
// export const getActivePlan = async (req, res) => {
//   try {
//     const plan = await Plan.findOne({ user: req.user._id }).sort({
//       createdAt: -1,
//     });
//     if (!plan) return res.status(404).json({ message: "No active plan found" });
//     res.json(plan);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// @desc    Get user's active plan
// @route   GET /api/plans/myplan
// export const getActivePlan = async (req, res) => {
//   try {
//     // Fetch the active plan for the logged-in user
//     const plan = await Plan.findOne({ user: req.user._id });

//     if (!plan) {
//       return res.status(404).json({ message: "No active plan found." });
//     }

//     // Return the ENTIRE plan document so the frontend receives
//     // all customDaily, customWeekly arrays, and plan notes on page load.
//     res.status(200).json(plan);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Inside controllers/planController.js

export const getActivePlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ user: req.user._id });

    if (!plan) {
      return res.status(404).json({ message: "No active plan found." });
    }

    let isModified = false;
    const now = new Date();

    // Time constants in milliseconds
    const ONE_DAY = 24 * 60 * 60 * 1000;
    // const ONE_DAY = 60 * 100;
    const ONE_WEEK = 7 * ONE_DAY;
    const TWENTY_ONE_DAYS = 21 * ONE_DAY;
    const NINETY_DAYS = 90 * ONE_DAY;

    // Helper function to manage the lifecycle of custom tasks
    const manageCustomTasks = (taskArray, maxAgeMs) => {
      if (!taskArray) return [];

      // Filter/Update tasks based on their age
      const processedTasks = taskArray.filter((task) => {
        const taskTime = task.createdAt ? new Date(task.createdAt) : now;
        const age = now - taskTime;

        // If the task has outlived its duration (e.g., 24 hours for daily)
        // if (age >= maxAgeMs) {
        //   // DEFAULT BEHAVIOR: Reset the task for the next cycle
        //   task.status = "pending"; // Unchecks the box
        //   task.createdAt = now; // Restarts the timer clock
        //   isModified = true;
        //   return false; // Keep the task in the list

        //   /*
        //     IF YOU WANT TO PERMANENTLY DELETE EXPIRED TASKS INSTEAD OF RESETTING THEM:
        //     Comment out the 4 lines above, and uncomment the line below:
        //     return false;    */
        // }
        // If the task cycle time has passed (e.g., 24 hours)
        if (age >= maxAgeMs) {
          if (task.status === "completed") {
            // 1. If completed AND time is up -> Delete it permanently
            isModified = true;
            return false;
          } else {
            // 2. If pending AND time is up -> Keep it, but reset its clock
            // (This ensures it doesn't instantly delete tomorrow when you check it off)
            task.createdAt = now;
            isModified = true;
            return true;
          }
        }

        return true; // Keep tasks that haven't expired yet
      });

      return processedTasks;
    };

    // Apply the logic to all 4 custom task arrays
    plan.customDaily = manageCustomTasks(plan.customDaily, ONE_DAY);
    plan.customWeekly = manageCustomTasks(plan.customWeekly, ONE_WEEK);

    if (plan.custom21Day) {
      plan.custom21Day = manageCustomTasks(plan.custom21Day, TWENTY_ONE_DAYS);
    }
    if (plan.custom90Day) {
      plan.custom90Day = manageCustomTasks(plan.custom90Day, NINETY_DAYS);
    }

    // Save changes to MongoDB ONLY if tasks were updated or deleted
    if (isModified) {
      await plan.save();
    }

    // Send the fresh, properly cycled plan back to the frontend
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status (pending, in-progress, finished)
export const updateTaskStatus = async (req, res) => {
  try {
    const { planId, taskId, status } = req.body;
    const plan = await Plan.findById(planId);

    if (!plan) return res.status(404).json({ message: "Plan not found" });
    if (plan.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const task = plan.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.status = status;
    await plan.save();

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel/Abandon current active plan
// @route   DELETE /api/plans/cancel
export const cancelPlan = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Find and delete the user's current plan
    const deletedPlan = await Plan.findOneAndDelete({ user: userId });

    if (!deletedPlan) {
      return res
        .status(404)
        .json({ message: "No active plan found to cancel." });
    }

    // 2. Reset the user's activePlan status in the User model
    const user = await User.findById(userId);
    user.activePlan = "none";
    user.planStartDate = null;
    await user.save();

    res
      .status(200)
      .json({ message: "Plan successfully abandoned. Ready to restart." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete and archive a finished plan
// @route   POST /api/plans/complete
export const completePlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ user: req.user._id });
    if (!plan)
      return res.status(404).json({ message: "No active plan found." });

    const user = await User.findById(req.user._id);

    // 1. Add this challenge to their permanent history (if not already there)
    if (!user.completedChallenges.includes(plan.planType)) {
      user.completedChallenges.push(plan.planType);
    }

    // 2. Reset their active status back to 'none'
    user.activePlan = "none";
    user.planStartDate = null;
    await user.save();

    // 3. Clear the plan from the active database
    await Plan.findOneAndDelete({ user: req.user._id });

    res.status(200).json({
      message: "Challenge successfully conquered and archived!",
      completedChallenges: user.completedChallenges,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // @desc    Add a custom task to a specific list
// // @route   POST /api/plans/custom-task
// export const addCustomTask = async (req, res) => {
//   try {
//     const { listType, title } = req.body;
//     const plan = await Plan.findOne({ user: req.user._id });
//     if (!plan)
//       return res.status(404).json({ message: "No active plan found." });

//     // Enforce the 10-task maximum limit
//     if (plan[listType].length >= 10) {
//       return res.status(400).json({
//         message: `Maximum limit of 10 tasks reached for this section.`,
//       });
//     }

//     plan[listType].push({ title, status: "pending" });
//     await plan.save();

//     res.status(200).json(plan);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Update a custom task's status
// // @route   PUT /api/plans/custom-task
// export const updateCustomTaskStatus = async (req, res) => {
//   try {
//     const { listType, taskId, status } = req.body;
//     const plan = await Plan.findOne({ user: req.user._id });
//     if (!plan)
//       return res.status(404).json({ message: "No active plan found." });

//     const task = plan[listType].id(taskId);
//     if (!task) return res.status(404).json({ message: "Task not found." });

//     task.status = status;
//     await plan.save();

//     res.status(200).json(plan);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Delete a custom task
// // @route   DELETE /api/plans/custom-task/:listType/:taskId
// export const deleteCustomTask = async (req, res) => {
//   try {
//     const { listType, taskId } = req.params;
//     const plan = await Plan.findOne({ user: req.user._id });
//     if (!plan)
//       return res.status(404).json({ message: "No active plan found." });

//     plan[listType].pull({ _id: taskId });
//     await plan.save();

//     res.status(200).json(plan);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }; // @desc    Add a custom task to a specific list
// @route   POST /api/plans/custom-task
export const addCustomTask = async (req, res) => {
  try {
    const { listType, title } = req.body;
    const plan = await Plan.findOne({ user: req.user._id });
    if (!plan)
      return res.status(404).json({ message: "No active plan found." });

    // Enforce the 10-task maximum limit
    if (plan[listType].length >= 10) {
      return res.status(400).json({
        message: `Maximum limit of 10 tasks reached for this section.`,
      });
    }

    plan[listType].push({ title, status: "pending" });
    await plan.save();

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a custom task's status
// @route   PUT /api/plans/custom-task
// export const updateCustomTaskStatus = async (req, res) => {
//   try {
//     const { listType, taskId, status } = req.body;

//     const plan = await Plan.findOne({ user: req.user._id });
//     if (!plan)
//       return res.status(404).json({ message: "No active plan found." });

//     const task = plan[listType].id(taskId);
//     if (!task) return res.status(404).json({ message: "Task not found." });

//     task.status = status;
//     await plan.save();

//     res.status(200).json(plan);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Inside controllers/planController.js

export const updateCustomTask = async (req, res) => {
  try {
    const { listType, taskId, status } = req.body;

    // 1. Validate the listType so the server doesn't crash if it receives a bad string
    const validLists = [
      "customDaily",
      "customWeekly",
      "custom21Day",
      "customMonthly",
      "custom90Day",
    ];
    if (!validLists.includes(listType)) {
      return res
        .status(400)
        .json({ message: `Invalid list type: ${listType}` });
    }

    const plan = await Plan.findOne({ user: req.user._id });
    if (!plan)
      return res.status(404).json({ message: "No active plan found." });

    // 2. Safely find the specific task inside the requested array using Mongoose's .id()
    const task = plan[listType].id(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // 3. Update the status and save
    task.status = status;
    await plan.save();

    // 4. Return the updated plan to the frontend
    res.status(200).json(plan);
  } catch (error) {
    console.error("PUT /custom-task Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a custom task
// @route   DELETE /api/plans/custom-task/:listType/:taskId
export const deleteCustomTask = async (req, res) => {
  try {
    const { listType, taskId } = req.params;
    const plan = await Plan.findOne({ user: req.user._id });
    if (!plan)
      return res.status(404).json({ message: "No active plan found." });

    plan[listType].pull({ _id: taskId });
    await plan.save();

    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Backend Controller Update: controllers/planController.js
// Add this function to handle updating the plan-level note:

export const updatePlanNote = async (req, res) => {
  try {
    const { note } = req.body;
    const plan = await Plan.findOne({ user: req.user._id });
    if (!plan)
      return res.status(404).json({ message: "No active plan found." });

    plan.planNote = note;
    await plan.save();
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
