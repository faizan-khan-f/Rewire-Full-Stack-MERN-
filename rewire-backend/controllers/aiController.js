import { GoogleGenerativeAI } from "@google/generative-ai";
import AIPlan from "../models/AIPlan.js";

// const genAI = new GoogleGenerativeAI(
// "AQ.Ab8RN6KAD_EpVpHiVELVNar572aIX4RiBZh2OzeIDVeAF98fAg",
// );

// export const generateCustomPlan = async (req, res) => {
//   try {
//     const { primaryFocus, challenges, durationDays } = req.body;

//     if (!primaryFocus || !challenges || !durationDays) {
//       return res.status(400).json({ message: "Missing required intake data." });
//     }

//     // 🟢 MOVE INITIALIZATION HERE: Inside the function!
//     // This ensures process.env is fully loaded before the SDK tries to read it.
//     const apiKey = process.env.GEMINI_API_KEY;

//     if (!apiKey) {
//       console.error(
//         "CRITICAL ERROR: API Key is undefined. Check your .env file.",
//       );
//       return res.status(500).json({ message: "Server configuration error." });
//     }

//     const genAI = new GoogleGenerativeAI(apiKey);

//     // 1. Define the exact JSON structure we need Gemini to return
//     const systemInstruction = `
//       You are an expert Behavioral Psychology and Habit Formation Coach.
//       Your goal is to design a highly practical, scientifically grounded routine to address:
//       - Primary Focus: ${primaryFocus}
//       - User Challenges: ${challenges.join(", ")}
//       - Duration: ${durationDays} days

//       Use concepts from Cognitive Behavioral Therapy (CBT), neuroplasticity, dopamine baseline management, and cortisol reduction.
//       Provide actionable, safe, and holistic steps. Do not provide clinical medical diagnoses.

//       You MUST return your response as a strictly valid JSON object matching this exact structure:
//       {
//         "aiStrategy": {
//           "corePhilosophy": "A short paragraph explaining the behavioral mechanism of this plan.",
//           "cognitiveReframes": ["Shift 1...", "Shift 2..."]
//         },
//         "dailyRoutines": [
//           { "title": "Morning Sunlight", "description": "Resets circadian rhythm and lowers morning cortisol." }
//         ],
//         "weeklyMilestones": [
//           { "title": "Dopamine Fasting Block", "description": "2 hours of zero-stimulation time to reset receptors." }
//         ]
//       }
//     `;

//     // 2. Call the Gemini API, enforcing JSON output
//     const model = genAI.getGenerativeModel({
//       model: "gemini-3.8-flash",
//       generationConfig: { responseMimeType: "application/json" },
//     });

//     const result = await model.generateContent(systemInstruction);
//     const aiResponse = result.response.text();

//     // 3. Parse the JSON and map it to our Schema
//     const parsedData = JSON.parse(aiResponse);

//     const newAIPlan = new AIPlan({
//       user: req.user._id,
//       intakeData: { primaryFocus, challenges, durationDays },
//       aiStrategy: parsedData.aiStrategy,
//       dailyRoutines: parsedData.dailyRoutines,
//       weeklyMilestones: parsedData.weeklyMilestones,
//     });

//     // 4. Save to Database and send to Frontend
//     await newAIPlan.save();
//     res.status(201).json(newAIPlan);
//   } catch (error) {
//     console.error("AI Generation Error:", error);
//     res
//       .status(500)
//       .json({ message: "Failed to generate AI plan. Please try again." });
//   }
// };
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import AIPlan from "../models/AIPlan.js";

// export const generateCustomPlan = async (req, res) => {
//   try {
//     // 1. Extract data, including the new customChallenge string
//     const { primaryFocus, challenges, durationDays, customChallenge } =
//       req.body;

//     if (!primaryFocus || !challenges || !durationDays) {
//       return res.status(400).json({ message: "Missing required intake data." });
//     }

//     // 2. Merge standard challenges with the user's manually typed challenge (if provided)
//     let allChallenges = [...challenges];
//     if (customChallenge && customChallenge.trim() !== "") {
//       allChallenges.push(customChallenge.trim());
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       console.error(
//         "CRITICAL ERROR: API Key is undefined. Check your .env file.",
//       );
//       return res.status(500).json({ message: "Server configuration error." });
//     }

//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({
//       model: "gemini-3.8-flash",
//       generationConfig: { responseMimeType: "application/json" },
//     });

//     // 3. Empathetic Psychologist Persona & Strict JSON Enforcement
//     const systemInstruction = `
//       You are a empathetic, understandable ,world-class Clinical Psychologist and Behavioral Coach.
//       Your tone must be humane, highly accessible, and validating. Avoid dense, cold medical jargon. Speak directly to the user as a supportive ally.

//       Design a practical, scientifically grounded daily routine addressing:
//       - Primary Goal: ${primaryFocus}
//       - Specific Hurdles: ${allChallenges.join(", ")}
//       - Duration: ${durationDays} days

//       Use concepts from human psychology,neuroplasticity , Cognitive Behavioral Therapy (CBT), and dopamine/cortisol management, but explain them simply and encouragingly.

//       You MUST return your response as a strictly valid JSON object matching exactly this structure:
//       {
//         "aiStrategy": {
//           "corePhilosophy": "Write a warm, compassionate and strategic points explaining how this plan will help them rewire their habits and why they shouldn't feel ashamed of their current struggles.",
//           "cognitiveReframes": [
//             "A shift in perspective regarding their specific challenges.",
//             "An empowering thought to replace a negative core belief."
//           ]
//         },
//         "dailyRoutines": [
//           { "title": "Understandable and to the point", "description": "In short and  Actionable daily step explained warmly and in brief bulletpoints.." }
//         ],
//         "weeklyMilestones": [
//           { "title": "Understandable and to the point", "description": " In Short and A larger goal or reflection exercise for the week in brief bulletpoints." }
//         ]
//       }
//     `;

//     let aiResponse;
//     let attempts = 3;

//     // 4. Auto-Retry Loop for Google API Traffic Spikes
//     while (attempts > 0) {
//       try {
//         const result = await model.generateContent(systemInstruction);
//         aiResponse = result.response.text();
//         break; // Success, exit loop
//       } catch (error) {
//         if (error.status === 503 && attempts > 1) {
//           console.log(
//             `Google servers overloaded. Retrying... (${attempts - 1} attempts left)`,
//           );
//           attempts--;
//           await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
//         } else {
//           console.error("Gemini API Error:", error);
//           throw error; // Bubble up to outer catch block
//         }
//       }
//     }

//     // 5. Parse the validated JSON
//     const parsedData = JSON.parse(aiResponse);

//     // 6. ERASURE LOGIC: Delete any existing plan for this specific user
//     await AIPlan.findOneAndDelete({ user: req.user._id });

//     // 7. Save the newly generated plan
//     const newAIPlan = new AIPlan({
//       user: req.user._id,
//       intakeData: {
//         primaryFocus,
//         challenges: allChallenges,
//         durationDays,
//       },
//       aiStrategy: parsedData.aiStrategy,
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

export const generateCustomPlan = async (req, res) => {
  try {
    const {
      primaryFocus,
      customFocus,
      challenges,
      durationDays,
      customChallenge,
    } = req.body;

    // 🟢 2. Resolve the final focus string
    const finalFocus =
      primaryFocus === "Other" && customFocus && customFocus.trim() !== ""
        ? customFocus.trim()
        : primaryFocus;

    // Merge standard challenges with the user's custom input
    let allChallenges = [...challenges];
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
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      generationConfig: { responseMimeType: "application/json" },
      temperature: 0.2, // Lower temperature speeds up token selection
      maxOutputTokens: 800, // Cap the output length to prevent run-on generation
    });

    // 🟢 UPDATED PROMPT: Empathetic tone + strict title-only JSON enforcement
    const systemInstruction = `
      Your name is Spidey.You are a empathetic, understandable,world-class Clinical Psychologist and Behavioral Coach.
      Your tone must be humane, highly accessible, and validating. Avoid dense, cold medical jargon. Briefly introduce yourself as Spidey in the corePhilosophy.
      Speak directly to the user as a supportive ally .Keep it all brief for speed.
      
      Design a practical, scientifically grounded daily routine addressing:
      - Primary Goal: ${finalFocus}
      - Specific Hurdles: ${allChallenges.join(", ")}
      - Duration: ${durationDays} days

      CRITICAL SPEED RULES: 
      - Generate EXACTLY 5 Daily Routines and EXACTLY 3 Weekly Milestones.
      - Keep all task titles strictly under 8 words.
      - Output raw JSON only. Do not use conversational filler.

      You MUST return your response as a strictly valid JSON object matching exactly this structure. 
      CRITICAL: For 'dailyRoutines' and 'weeklyMilestones', DO NOT include descriptions. Provide ONLY a clear, actionable 'title'.

      {
        "aiStrategy": {
          "corePhilosophy": "Write a warm, strategic paragraph explaining how this plan will help them rewire their habits and why they shouldn't feel ashamed of their current struggles.Use practical human psychology and evolutionary psychology in custom focus tasks",
          "cognitiveReframes": [
            "A shift in perspective regarding their specific challenges.",
            "An empowering thought to replace a negative core belief."
            
          ]
        },
        "dailyRoutines": [
          { "title": "Morning Sunlight exposure for 10 minutes" },
          { "title": "Write down one trigger you noticed today" }
        ],
        "weeklyMilestones": [
          { "title": "Complete a 2-hour dopamine fast away from all screens" },
          { "title": "Review your cognitive reframes out loud" }
        ]
      }
    `;

    let aiResponse;
    let attempts = 3;

    // Auto-Retry Loop for Google API Traffic Spikes
    while (attempts > 0) {
      try {
        const result = await model.generateContent(systemInstruction);
        aiResponse = result.response.text();
        break;
      } catch (error) {
        if (error.status === 503 && attempts > 1) {
          attempts--;
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          throw error;
        }
      }
    }

    const parsedData = JSON.parse(aiResponse);

    // Delete any existing plan for this user before saving the new one
    await AIPlan.findOneAndDelete({ user: req.user._id });

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
    res.status(201).json(newAIPlan);
  } catch (error) {
    console.error("Plan Generation Error:", error);
    res
      .status(500)
      .json({ message: "Failed to generate AI plan. Please try again." });
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

// controllers/aiController.js

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
