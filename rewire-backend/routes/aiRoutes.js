import express from "express";
// import { generateCustomPlan } from "../controllers/aiController.js";
import { protect } from "../middlewares/authMiddleware.js";
import {
  generateCustomPlan,
  getActiveAIPlan,
  resetCustomPlan,
  toggleTaskCompletion,
} from "../controllers/aiController.js";
// import express from "express";
import { chatWithSpidey } from "../controllers/aiController.js";

// const router = express.Router();

// router.post('/generate', generatePlan);

// export default router;

// Import the new routes

const router = express.Router();

// POST /api/ai/generate
router.post("/generate", protect, generateCustomPlan);
// 🟢 NEW: Route to delete/reset the plan
router.delete("/plan", protect, resetCustomPlan);
// Add this below your POST route
// 🟢 Route for toggling task statuses
router.patch("/plan/task", protect, toggleTaskCompletion);
router.get("/myplan", protect, getActiveAIPlan);
router.post("/chat", chatWithSpidey); // New Spidey Chat endpoint

export default router;
