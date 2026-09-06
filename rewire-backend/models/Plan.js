import mongoose from "mongoose";

// Sub-schema for the generated system tasks
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dayNumber: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "finished"],
    default: "pending",
  },
});

// Sub-schema for user-generated custom tasks
const customTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ["pending", "finished"], default: "pending" },
});

const planSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planType: {
      type: String,
      enum: ["reset", "reset-and-rewire", "reset-rewire-and-rebounce"],
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    tasks: [taskSchema],
    // 1. Backend Model Update: models/Plan.js
    // Add the single plan-level note field to your planSchema:

    planNote: { type: String, default: "" }, //*

    // --- NEW: CUSTOM TASK CONTAINERS ---
    customDaily: [customTaskSchema],
    customWeekly: [customTaskSchema],
    custom21Day: [customTaskSchema],
    customMonthly: [customTaskSchema],
    custom90Day: [customTaskSchema],
  },
  { timestamps: true },
);

const Plan = mongoose.model("Plan", planSchema);

export default Plan;
