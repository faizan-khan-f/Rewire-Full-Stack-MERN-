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

export default router;
