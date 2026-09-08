import express from "express";
import {
  startPlan,
  getActivePlan,
  updateTaskStatus,
  cancelPlan,
  completePlan,
  addCustomTask,
  updateCustomTaskStatus,
  deleteCustomTask,
  updatePlanNote, //** */
} from "../controllers/planController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Core Plan Routes
router.post("/start", protect, startPlan);
router.get("/myplan", protect, getActivePlan);
router.put("/task", protect, updateTaskStatus);
router.delete("/cancel", protect, cancelPlan);
router.post("/complete", protect, completePlan);

// Custom Task Routes
router.post("/custom-task", protect, addCustomTask);
router.put("/custom-task", protect, updateCustomTaskStatus);
router.delete("/custom-task/:listType/:taskId", protect, deleteCustomTask);
// Add the route:
router.put("/plan-note", protect, updatePlanNote); //*

// Example backend route handler
// router.put("/plan", verifyToken, async (req, res) => {
//   try {
//     const { activePlan } = req.body;
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { activePlan },
//       { new: true },
//     ).select("-password");
//     res.json(updatedUser);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update active plan" });
//   }
// });

export default router;
