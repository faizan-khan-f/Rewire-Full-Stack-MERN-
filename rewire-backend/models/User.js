import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    activePlan: {
      type: String,
      enum: ["none", "reset", "reset-and-rewire", "reset-rewire-and-rebounce"],
      default: "none",
    },
    completedChallenges: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
