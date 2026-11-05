// import { GoogleGenerativeAI } from "@google/generative-ai";
// import AIPlan from "../models/AIPlan.js";

// //

// export const generateCustomPlan = async (req, res) => {
//   try {
//     const {
//       primaryFocus,
//       customFocus,
//       challenges,
//       durationDays,
//       customChallenge,
//     } = req.body;

//     // 🟢 2. Resolve the final focus string
//     const finalFocus =
//       primaryFocus === "Other" && customFocus && customFocus.trim() !== ""
//         ? customFocus.trim()
//         : primaryFocus;

//     // Merge standard challenges with the user's custom input
//     let allChallenges = [...challenges];
//     if (customChallenge && customChallenge.trim() !== "") {
//       allChallenges.push(customChallenge.trim());
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       return res
//         .status(500)
//         .json({ message: "Server configuration error. API Key missing." });
//     }

//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({
//       model: "gemini-3.8-flash",
//       generationConfig: { responseMimeType: "application/json" },
//       temperature: 0.2, // Lower temperature speeds up token selection
//       maxOutputTokens: 800, // Cap the output length to prevent run-on generation
//     });

//     // 🟢 UPDATED PROMPT: Empathetic tone + strict title-only JSON enforcement
//     const systemInstruction = `
//       Your name is Spidey.You are a empathetic, understandable,world-class Clinical Psychologist and Behavioral Coach.
//       Your tone must be humane, highly accessible, and validating. Avoid dense, cold medical jargon. Briefly introduce yourself as Spidey in the corePhilosophy.
//       Speak directly to the user as a supportive ally .Keep it all brief for speed.

//       Design a practical, scientifically grounded daily routine addressing:
//       - Primary Goal: ${finalFocus}
//       - Specific Hurdles: ${allChallenges.join(", ")}
//       - Duration: ${durationDays} days

//       CRITICAL SPEED RULES:
//       - Generate EXACTLY 5 Daily Routines and EXACTLY 3 Weekly Milestones.
//       - Keep all task titles strictly under 8 words.
//       - Output raw JSON only. Do not use conversational filler.

//       You MUST return your response as a strictly valid JSON object matching exactly this structure.
//       CRITICAL: For 'dailyRoutines' and 'weeklyMilestones', DO NOT include descriptions. Provide ONLY a clear, actionable 'title'.

//       {
//         "aiStrategy": {
//           "corePhilosophy": "Write a warm, strategic paragraph explaining how this plan will help them rewire their habits and why they shouldn't feel ashamed of their current struggles.Use practical human psychology and evolutionary psychology in custom focus tasks",
//           "cognitiveReframes": [
//             "A shift in perspective regarding their specific challenges.",
//             "An empowering thought to replace a negative core belief."

//           ]
//         },
//         "dailyRoutines": [
//           { "title": "Morning Sunlight exposure for 10 minutes" },
//           { "title": "Write down one trigger you noticed today" }
//         ],
//         "weeklyMilestones": [
//           { "title": "Complete a 2-hour dopamine fast away from all screens" },
//           { "title": "Review your cognitive reframes out loud" }
//         ]
//       }
//     `;

//     let aiResponse;
//     let attempts = 3;

//     // Auto-Retry Loop for Google API Traffic Spikes
//     while (attempts > 0) {
//       try {
//         const result = await model.generateContent(systemInstruction);
//         aiResponse = result.response.text();
//         break;
//       } catch (error) {
//         if (error.status === 503 && attempts > 1) {
//           attempts--;
//           await new Promise((resolve) => setTimeout(resolve, 2000));
//         } else {
//           throw error;
//         }
//       }
//     }

//     const parsedData = JSON.parse(aiResponse);

//     // Delete any existing plan for this user before saving the new one
//     await AIPlan.findOneAndDelete({ user: req.user._id });

//     const newAIPlan = new AIPlan({
//       user: req.user._id,
//       intakeData: {
//         primaryFocus: finalFocus,
//         challenges: allChallenges,
//         durationDays,
//       },
//       aiStrategy: parsedData.aiStrategy,
//       // The AI provides the title, Mongoose automatically adds status: "pending"
//       dailyRoutines: parsedData.dailyRoutines,
//       weeklyMilestones: parsedData.weeklyMilestones,
//     });

//     await newAIPlan.save();
//     res.status(201).json(newAIPlan);
//   } catch (error) {
//     console.error("Plan Generation Error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to generate AI plan. Please try again." });
//   }
// };

// export const getActiveAIPlan = async (req, res) => {
//   try {
//     const plan = await AIPlan.findOne({ user: req.user._id, isActive: true });
//     res.status(200).json(plan);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch AI plan." });
//   }
// };

// // controllers/aiController.js

// export const resetCustomPlan = async (req, res) => {
//   try {
//     // Find and delete the plan belonging to the authenticated user
//     const deletedPlan = await AIPlan.findOneAndDelete({ user: req.user._id });

//     if (!deletedPlan) {
//       return res
//         .status(404)
//         .json({ message: "No active plan found to reset." });
//     }

//     res
//       .status(200)
//       .json({ message: "Plan reset successfully. Ready for a new intake." });
//   } catch (error) {
//     console.error("Plan Reset Error:", error);
//     res.status(500).json({ message: "Failed to reset plan." });
//   }
// };

// export const toggleTaskCompletion = async (req, res) => {
//   try {
//     const { taskId, taskType } = req.body;

//     // Validate the taskType string
//     if (taskType !== "daily" && taskType !== "weekly") {
//       return res
//         .status(400)
//         .json({ message: "Invalid task type. Must be 'daily' or 'weekly'." });
//     }

//     const plan = await AIPlan.findOne({ user: req.user._id });
//     if (!plan) {
//       return res.status(404).json({ message: "Active plan not found." });
//     }

//     // Reference the correct sub-document array
//     const taskArray =
//       taskType === "daily" ? plan.dailyRoutines : plan.weeklyMilestones;

//     // Locate the specific task using Mongoose's built-in array id method
//     const task = taskArray.id(taskId);
//     if (!task) {
//       return res
//         .status(404)
//         .json({ message: "Task not found in the current plan." });
//     }

//     // Toggle the exact enum string
//     task.status = task.status === "completed" ? "pending" : "completed";

//     await plan.save();

//     // Return the entirely updated plan document to overwrite the frontend state
//     res.status(200).json(plan);
//   } catch (error) {
//     console.error("Toggle Task Error:", error);
//     res.status(500).json({ message: "Failed to update task status." });
//   }
// };
import { GoogleGenerativeAI } from "@google/generative-ai";
import AIPlan from "../models/AIPlan.js";

// ---------------------------------------------------------------------------
// Gemini helpers
// ---------------------------------------------------------------------------

// Tried in order. If one is overloaded (503/429) or doesn't exist (404),
// the next one is used. Override the first with GEMINI_MODEL in your .env.
const MODEL_CHAIN = [
  process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
];
// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const ATTEMPTS_PER_MODEL = 2;
const RETRYABLE_STATUS = [429, 503, 504];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class InvalidAIResponseError extends Error {}

// Turns the raw model text into a validated plan object.
const parsePlan = (text) => {
  // Models sometimes wrap JSON in ```json fences even in JSON mode.
  const cleaned = String(text ?? "")
    .replace(/```json|```/gi, "")
    .trim();

  let data;
  try {
    data = JSON.parse(cleaned);
  } catch {
    throw new InvalidAIResponseError("AI returned invalid JSON.");
  }

  const toTasks = (arr) =>
    Array.isArray(arr)
      ? arr
          .map((t) => ({ title: String(t?.title ?? "").trim() }))
          .filter((t) => t.title)
      : [];

  const plan = {
    aiStrategy: {
      corePhilosophy: String(data?.aiStrategy?.corePhilosophy ?? "").trim(),
      cognitiveReframes: Array.isArray(data?.aiStrategy?.cognitiveReframes)
        ? data.aiStrategy.cognitiveReframes.map(String).filter(Boolean)
        : [],
    },
    dailyRoutines: toTasks(data?.dailyRoutines),
    weeklyMilestones: toTasks(data?.weeklyMilestones),
  };

  if (
    !plan.aiStrategy.corePhilosophy ||
    plan.dailyRoutines.length === 0 ||
    plan.weeklyMilestones.length === 0
  ) {
    throw new InvalidAIResponseError("AI response was incomplete.");
  }

  return plan;
};

// Retries each model with exponential backoff, then falls back to the next.
const generatePlanWithFallback = async (genAI, prompt) => {
  let lastError;

  for (const modelName of MODEL_CHAIN) {
    // NOTE: temperature / maxOutputTokens must live INSIDE generationConfig,
    // otherwise the SDK silently ignores them.
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        // Keep this generous: if the JSON is cut off mid-way it won't parse.
        // (Thinking-capable models also spend part of this budget.)
        maxOutputTokens: 2048,
      },
    });

    for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const plan = parsePlan(result.response.text());
        console.log(`Plan generated with ${modelName} (attempt ${attempt})`);
        return plan;
      } catch (error) {
        lastError = error;

        // Model name doesn't exist / isn't available to this key: next model.
        if (error?.status === 404) break;

        const retryable =
          RETRYABLE_STATUS.includes(error?.status) ||
          error instanceof InvalidAIResponseError;

        // Auth errors, bad requests, safety blocks, etc.: retrying won't help.
        if (!retryable) throw error;

        if (attempt < ATTEMPTS_PER_MODEL) {
          const delay = 1000 * 2 ** (attempt - 1) + Math.random() * 500; // ~1s, 2s
          console.warn(
            `${modelName} failed (${error?.status ?? error.message}), retrying in ${Math.round(delay)}ms`,
          );
          await sleep(delay);
        }
      }
    }

    console.warn(`Giving up on ${modelName}, trying next model...`);
  }

  throw lastError;
};

// ---------------------------------------------------------------------------
// Controllers
// ---------------------------------------------------------------------------

export const generateCustomPlan = async (req, res) => {
  try {
    const {
      primaryFocus,
      customFocus,
      challenges,
      durationDays,
      customChallenge,
    } = req.body;

    if (!primaryFocus || !durationDays) {
      return res
        .status(400)
        .json({ message: "primaryFocus and durationDays are required." });
    }

    // Resolve the final focus string
    const finalFocus =
      primaryFocus === "Other" && customFocus && customFocus.trim() !== ""
        ? customFocus.trim()
        : primaryFocus;

    // Merge standard challenges with the user's custom input
    const allChallenges = Array.isArray(challenges) ? [...challenges] : [];
    if (customChallenge && customChallenge.trim() !== "") {
      allChallenges.push(customChallenge.trim());
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ message: "Server configuration error. API Key missing." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `
      Your name is Spidey. You are an empathetic, understandable, world-class Clinical Psychologist and Behavioral Coach.
      Your tone must be humane, highly accessible, and validating. Avoid dense, cold medical jargon. Briefly introduce yourself as Spidey in the corePhilosophy.
      Speak directly to the user as a supportive ally. Keep it all brief for speed.

      Design a practical, scientifically grounded daily routine addressing:
      - Primary Goal: ${finalFocus}
      - Specific Hurdles: ${allChallenges.join(", ") || "None specified"}
      - Duration: ${durationDays} days

      CRITICAL SPEED RULES:
      - Generate EXACTLY 5 Daily Routines and EXACTLY 3 Weekly Milestones.
      - Keep all task titles strictly under 8 words.
      - Output raw JSON only. Do not use conversational filler.

      You MUST return your response as a strictly valid JSON object matching exactly this structure.
      CRITICAL: For 'dailyRoutines' and 'weeklyMilestones', DO NOT include descriptions. Provide ONLY a clear, actionable 'title'.

      {
        "aiStrategy": {
          "corePhilosophy": "Write a warm, strategic paragraph explaining how this plan will help them rewire their habits and why they shouldn't feel ashamed of their current struggles. Use practical human psychology and evolutionary psychology in custom focus tasks",
          "cognitiveReframes": [
            "A shift in perspective regarding their specific challenges.",
            "An empowering thought to replace a negative core belief."
          ]
        },
        "dailyRoutines": [
          { "title": "Morning sunlight exposure for 10 minutes" },
          { "title": "Write down one trigger you noticed today" }
        ],
        "weeklyMilestones": [
          { "title": "Complete a 2-hour dopamine fast away from all screens" },
          { "title": "Review your cognitive reframes out loud" }
        ]
      }
    `;

    const parsedData = await generatePlanWithFallback(genAI, prompt);

    const newAIPlan = new AIPlan({
      user: req.user._id,
      intakeData: {
        primaryFocus: finalFocus,
        challenges: allChallenges,
        durationDays,
      },
      aiStrategy: parsedData.aiStrategy,
      // The AI provides the title, Mongoose automatically adds status: "pending"
      dailyRoutines: parsedData.dailyRoutines,
      weeklyMilestones: parsedData.weeklyMilestones,
    });

    await newAIPlan.save();

    // Only remove the old plan AFTER the new one is safely saved,
    // so a failed generation never leaves the user with no plan.
    await AIPlan.deleteMany({
      user: req.user._id,
      _id: { $ne: newAIPlan._id },
    });

    res.status(201).json(newAIPlan);
  } catch (error) {
    console.error("Plan Generation Error:", error);

    const busy =
      RETRYABLE_STATUS.includes(error?.status) ||
      error instanceof InvalidAIResponseError;

    res.status(busy ? 503 : 500).json({
      message: busy
        ? "The AI service is busy right now. Please try again in a moment."
        : "Failed to generate AI plan. Please try again.",
    });
  }
};

export const getActiveAIPlan = async (req, res) => {
  try {
    const plan = await AIPlan.findOne({ user: req.user._id, isActive: true });
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch AI plan." });
  }
};

export const resetCustomPlan = async (req, res) => {
  try {
    // Find and delete the plan belonging to the authenticated user
    const deletedPlan = await AIPlan.findOneAndDelete({ user: req.user._id });

    if (!deletedPlan) {
      return res
        .status(404)
        .json({ message: "No active plan found to reset." });
    }

    res
      .status(200)
      .json({ message: "Plan reset successfully. Ready for a new intake." });
  } catch (error) {
    console.error("Plan Reset Error:", error);
    res.status(500).json({ message: "Failed to reset plan." });
  }
};

export const toggleTaskCompletion = async (req, res) => {
  try {
    const { taskId, taskType } = req.body;

    // Validate the taskType string
    if (taskType !== "daily" && taskType !== "weekly") {
      return res
        .status(400)
        .json({ message: "Invalid task type. Must be 'daily' or 'weekly'." });
    }

    const plan = await AIPlan.findOne({ user: req.user._id });
    if (!plan) {
      return res.status(404).json({ message: "Active plan not found." });
    }

    // Reference the correct sub-document array
    const taskArray =
      taskType === "daily" ? plan.dailyRoutines : plan.weeklyMilestones;

    // Locate the specific task using Mongoose's built-in array id method
    const task = taskArray.id(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found in the current plan." });
    }

    // Toggle the exact enum string
    task.status = task.status === "completed" ? "pending" : "completed";

    await plan.save();

    // Return the entirely updated plan document to overwrite the frontend state
    res.status(200).json(plan);
  } catch (error) {
    console.error("Toggle Task Error:", error);
    res.status(500).json({ message: "Failed to update task status." });
  }
};

// export const chatWithSpidey = async (req, res) => {
//   try {
//     const { message, history } = req.body;

//     // 1. Force the history to ALWAYS start with a 'user' system prompt
//     let formattedHistory = [
//       {
//         role: "user",
//         parts: [
//           {
//             text: "System Instruction: You are 'Spidey', a highly analytical, straight-talking, and motivating AI Clinical Coach for a productivity app. Keep responses concise, actionable, and focused on rewiring habits.",
//           },
//         ],
//       },
//       {
//         role: "model",
//         parts: [
//           { text: "Understood. I am Spidey. Let's optimize your focus." },
//         ],
//       },
//     ];

//     // 2. Append the frontend history, skipping the hardcoded UI greeting
//     if (history && history.length > 0) {
//       history.forEach((msg, index) => {
//         // Skip the very first message if it is the "Hey! I'm Spidey..." greeting
//         if (index === 0 && msg.role === "model") return;

//         formattedHistory.push({
//           role: msg.role === "model" ? "model" : "user",
//           parts: [{ text: msg.text }],
//         });
//       });
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });
//     const chat = model.startChat({ history: formattedHistory });

//     const result = await chat.sendMessage(message);
//     const responseText = result.response.text();

//     res.status(200).json({ reply: responseText });
//   } catch (error) {
//     console.error("Spidey Chat Error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to connect to Spidey's neural net." });
//   }
// };
export const chatWithSpidey = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ message: "Server configuration error. API Key missing." });
    }
    const genAI = new GoogleGenerativeAI(apiKey);

    // History must start with a 'user' turn and alternate user/model
    const formattedHistory = [
      {
        role: "user",
        parts: [
          {
            text: "System Instruction: You are 'Spidey', a highly analytical, straight-talking, and motivating AI Clinical Coach for a productivity app. Keep responses concise, actionable, and focused on rewiring habits and try to talk in Hinglish.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "Understood. I am Spidey. Let's optimize your focus." },
        ],
      },
    ];

    // Append frontend history, skipping the hardcoded UI greeting
    if (Array.isArray(history)) {
      history.forEach((msg, index) => {
        if (index === 0 && msg.role === "model") return;
        formattedHistory.push({
          role: msg.role === "model" ? "model" : "user",
          parts: [{ text: msg.text }],
        });
      });
    }

    let lastError;
    for (const modelName of MODEL_CHAIN) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({ history: formattedHistory });
        const result = await chat.sendMessage(message);
        return res.status(200).json({ reply: result.response.text() });
      } catch (error) {
        lastError = error;
        // Overloaded or unavailable model: try the next one
        if (![404, ...RETRYABLE_STATUS].includes(error?.status)) throw error;
        console.warn(
          `Chat: ${modelName} failed (${error.status}), trying next...`,
        );
      }
    }
    throw lastError;
  } catch (error) {
    console.error("Spidey Chat Error:", error);
    const busy = RETRYABLE_STATUS.includes(error?.status);
    res.status(busy ? 503 : 500).json({
      message: busy
        ? "Spidey is busy right now. Please try again in a moment."
        : "Failed to connect to Spidey's neural net.",
    });
  }
};
