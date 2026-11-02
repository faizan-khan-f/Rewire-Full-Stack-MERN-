import { useState } from "react";
import axios from "axios";
import { Brain, ShieldAlert, Loader2, CheckCircle2 } from "lucide-react";
import { Bot } from "lucide-react"; // 🟢 Import the Bot icon

const AIPlanGenerator = ({ token, API_URL, onPlanGenerated }) => {
  const [primaryFocus, setPrimaryFocus] = useState("");
  const [challenges, setChallenges] = useState([]);
  const [durationDays, setDurationDays] = useState(21);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 🟢 NEW: Add state for the custom input
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customChallenge, setCustomChallenge] = useState("");

  // ... rest of your component logic

  const availableChallenges = [
    "Anxiety & Stress",
    "Panic Triggers",
    "Low Dopamine/Motivation",
    "Trauma Responses",
    "Procrastination",
    "Brain Fog",
  ];
  // 1. Define your options array at the top of your component (if you haven't already)
  const focusOptions = [
    "Dopamine Reset(Increase Motivation & Focus)",
    "Lower Stress/Cortisol",
    "Overcome Anxiety",
    "Build Consistency",
    "Other", // 🟢 Added directly to the array
  ];

  const handleToggleChallenge = (challenge) => {
    setChallenges((prev) =>
      prev.includes(challenge)
        ? prev.filter((c) => c !== challenge)
        : [...prev, challenge],
    );
  };

  // const handleGenerate = async (e) => {
  //   e.preventDefault();
  //   if (!primaryFocus || challenges.length === 0) {
  //     return setError(
  //       "Please select a primary focus and at least one challenge.",
  //     );
  //   }
  //   if (!disclaimerAccepted) {
  //     return setError("You must accept the medical disclaimer to continue.");
  //   }

  //   setIsLoading(true);
  //   setError("");

  //   try {
  //     const res = await axios.post(
  //       `${API_URL}/ai/generate`,
  //       { primaryFocus, challenges, durationDays: Number(durationDays) },
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );
  //     onPlanGenerated(res.data); // Pass generated plan up to Dashboard state
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Failed to generate AI plan.");
  //     setIsLoading(false);
  //   }
  // };
  // 1. Add this near your other state variables
  const [customFocus, setCustomFocus] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();

    // // Allow submission if they selected a default challenge OR typed a custom one
    // if (!primaryFocus || (challenges.length === 0 && !customChallenge.trim())) {
    //   return setError(
    //     "Please select a primary focus and at least one challenge (or write your own).",
    //   );
    // }

    // if (!disclaimerAccepted) {
    //   return setError("You must accept the medical disclaimer to continue.");
    // }

    // setIsLoading(true);
    // setError("");
    // Resolve the focus: if "Other" is selected but the input is blank, throw error
    if (primaryFocus === "Other" && !customFocus.trim()) {
      return setError("Please enter your custom focus.");
    }

    if (!primaryFocus || (challenges.length === 0 && !customChallenge.trim())) {
      return setError(
        "Please select a primary focus and at least one challenge.",
      );
    }

    if (!disclaimerAccepted) {
      return setError("You must accept the medical disclaimer to continue.");
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${API_URL}/ai/generate`,
        {
          primaryFocus,
          customFocus,
          challenges,
          durationDays: Number(durationDays),
          customChallenge, // 🟢 Send the manual problem input to the backend
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onPlanGenerated(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate AI plan.");
      setIsLoading(false);
    }
  };

  // if (isLoading) {
  //   return (
  //     <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center space-y-4 text-center min-h-[400px] transition-colors">
  //       <Loader2 className="animate-spin text-emerald-500" size={48} />
  //       <h3 className="text-xl font-bold text-gray-900 dark:text-white">
  //         Analyzing Behavioral Patterns...
  //       </h3>
  //       <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
  //         Designing your custom neuroplasticity protocol based on Practical
  //         behavioural psychology,CBT principles and dopamine management. This
  //         takes a few seconds.
  //       </p>
  //     </div>
  //   );
  // }
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-fade-in">
        <div className="relative flex items-center justify-center">
          {/* Background glowing/pulsing web effect */}
          <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-30 animate-pulse rounded-full w-24 h-24 m-auto"></div>

          {/* Spidey Avatar bouncing */}
          <div className="bg-gray-800 p-5 rounded-full border-2 border-emerald-500 relative z-10 animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Bot size={40} className="text-emerald-400" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Spidey is analyzing your profile...
          </h3>
          <p className="text-emerald-500 text-sm font-medium animate-pulse">
            Weaving your custom neuro-protocol
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <Brain size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Spidey(AI Assistant)
        </h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Primary Focus */}
        <div>
          {/* <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            1. What is your primary physiological goal?
          </label> */}
          {/* <select
            value={primaryFocus}
            onChange={(e) => setPrimaryFocus(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select a focus...</option>
            <option value="Lower Cortisol (Stress Reduction)">
              Lower Cortisol (Stress Reduction)
            </option>
            <option value="Dopamine Reset (Focus & Drive)">
              Dopamine Reset (Focus & Drive)
            </option>
            <option value="Nervous System Regulation">
              Nervous System Regulation
            </option>
            {/* 🟢 Add this to the bottom of your primaryFocus selection area */}
          {/* <option value="Other">
              {/* Other (Custom Focus) */}
          {/* <label className="flex items-center space-x-3 p-3 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer hover:bg-gray-750 transition-colors">
                <input
                  type="radio"
                  name="primaryFocus"
                  value="Other"
                  checked={primaryFocus === "Other"}
                  onChange={(e) => setPrimaryFocus(e.target.value)}
                  className="w-5 h-5 text-emerald-500 bg-gray-900 border-gray-600 focus:ring-emerald-500"
                /> */}
          {/* <span className="text-gray-200 font-medium">
                  Other (Custom Focus)
                </span>
              </label> */}
          {/* 🟢 Conditionally render the text input if "Other" is selected */}
          {/* {primaryFocus === "Other" && (
                <div className="mt-3 animate-fade-in">
                  <input
                    type="text"
                    value={customFocus}
                    onChange={(e) => setCustomFocus(e.target.value)}
                    placeholder="E.g., Beat procrastination, Rebuild self-esteem..."
                    className="w-full p-3.5 bg-gray-900 border border-emerald-500/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    autoFocus
                  />
        //         </div> */}
          {/* //       )}
        //     </option>
        //   </select> */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white mb-3">
              Select Your Primary Focus
            </h3>
            <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
              {focusOptions.map((option) => (
                <div key={option} className="font-medium flex flex-col ">
                  <label
                    className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                      primaryFocus === option
                        ? "bg-emerald-900/30 border-emerald-500"
                        : "bg-gray-800 border-gray-700 hover:border-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="primaryFocus"
                      value={option}
                      checked={primaryFocus === option}
                      onChange={(e) => {
                        setPrimaryFocus(e.target.value);
                        // Clear custom text if they switch back to a standard option
                        if (e.target.value !== "Other") setCustomFocus("");
                      }}
                      className="w-5 h-5 text-emerald-500 bg-gray-900 border-gray-600 focus:ring-emerald-500 mr-3"
                    />
                    <span
                      className={`font-medium ${primaryFocus === option ? "text-emerald-400" : "text-gray-200"}`}
                    >
                      {option === "Other" ? "Other (Custom Focus)" : option}
                    </span>
                  </label>

                  {/* 🟢 Inline Custom Input: Only renders under the 'Other' block when selected */}
                  {option === "Other" && primaryFocus === "Other" && (
                    <div className="mt-2 animate-fade-in">
                      <input
                        type="text"
                        value={customFocus}
                        onChange={(e) => setCustomFocus(e.target.value)}
                        placeholder="E.g., Beat procrastination, Rebuild self-esteem..."
                        className="w-full p-3.5 bg-gray-900 border border-emerald-500/50 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenges (Multi-select Grid) */}
        <div>
          <label className="block text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
            2. Select current obstacles:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {availableChallenges.map((challenge) => (
              <button
                type="button"
                key={challenge}
                onClick={() => handleToggleChallenge(challenge)}
                className={`px-3 py-2 text-sm rounded-lg border text-left transition-all ${
                  challenges.includes(challenge)
                    ? "bg-emerald-50 dark:bg-emerald-900/40 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold"
                    : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300"
                }`}
              >
                {challenges.includes(challenge) && (
                  <CheckCircle2 size={14} className="inline mr-1" />
                )}
                {challenge}
              </button>
            ))}
          </div>
        </div>

        {/* Existing challenges list usually goes here */}

        {/* 🟢 NEW: The 'Other' toggle and text input */}
        <div className="mt-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showCustomInput}
              onChange={(e) => {
                setShowCustomInput(e.target.checked);
                // Clear the text if the user unchecks the box
                if (!e.target.checked) setCustomChallenge("");
              }}
              className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-900"
            />
            <span className="text-gray-300 font-medium">
              Other (Specify your own)
            </span>
          </label>

          {showCustomInput && (
            <div className="mt-3">
              <input
                type="text"
                value={customChallenge}
                onChange={(e) => setCustomChallenge(e.target.value)}
                placeholder="E.g., I struggle with doomscrolling in bed/Specific disorders/heartbreak.."
                className="w-full p-3 bg-gray-800 rounded-lg border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            3. Protocol Duration
          </label>
          <div className="flex gap-4">
            {[21, 60, 90].map((days) => (
              <label
                key={days}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                <input
                  type="radio"
                  name="duration"
                  value={days}
                  checked={durationDays === days}
                  onChange={() => setDurationDays(days)}
                  className="accent-emerald-500 w-4 h-4"
                />
                <span>{days} Days</span>
              </label>
            ))}
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 flex items-start space-x-3">
          <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div className="flex flex-col">
            <p className="text-xs text-amber-800 dark:text-amber-200 mb-2 leading-relaxed">
              <strong>Disclaimer:</strong> This tool utilizes AI to structure
              behavioral habits and neuroplasticity exercises. It is not a
              substitute for professional clinical therapy or psychiatric
              medical treatment.
            </p>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={disclaimerAccepted}
                onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                className="accent-amber-600 w-4 h-4 rounded"
              />
              <span className="text-xs font-bold text-amber-900 dark:text-amber-100">
                I understand and agree to proceed.
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-transform active:scale-95 shadow-lg shadow-emerald-600/20"
        >
          Generate Custom Protocol
        </button>
      </form>
    </div>
  );
};

export default AIPlanGenerator;
