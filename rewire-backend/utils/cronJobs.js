// utils/cronJobs.js
import cron from "node-cron";
import AIPlan from "../models/AIPlan.js";

export const startCronJobs = () => {
  // 🟢 Daily Reset: Runs every night at exactly 12:00 AM
  cron.schedule(
    "0 0 * * *",
    async () => {
      try {
        console.log("Running Daily Cron: Resetting AI daily routines...");
        await AIPlan.updateMany(
          {}, // Empty filter targets all plans in the database
          { $set: { "dailyRoutines.$[].status": "pending" } },
        );
        console.log("Success: All AI daily routines flipped to 'pending'.");
      } catch (error) {
        console.error("Daily Cron Error:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata", // Ensures midnight aligns with your local time
    },
  );

  // 🟢 Weekly Reset: Runs every Sunday at exactly 12:00 AM
  cron.schedule(
    "0 0 * * 0",
    async () => {
      try {
        console.log("Running Weekly Cron: Resetting AI weekly milestones...");
        await AIPlan.updateMany(
          {},
          { $set: { "weeklyMilestones.$[].status": "pending" } },
        );
        console.log("Success: All AI weekly milestones flipped to 'pending'.");
      } catch (error) {
        console.error("Weekly Cron Error:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata",
    },
  );
};
