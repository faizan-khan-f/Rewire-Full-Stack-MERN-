import React, { useState, useEffect, useRef } from "react";

const LockIn = () => {
  const [focusText, setFocusText] = useState("");
  const [inputHours, setInputHours] = useState(0);
  const [inputMinutes, setInputMinutes] = useState(25);

  const initialSeconds = 0 * 3600 + 25 * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [totalTime, setTotalTime] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const endTimeRef = useRef(null);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleNavigation = (e) => {
      if (!isRunning) return;
      const anchor = e.target.closest("a");
      if (anchor) {
        const targetPath = anchor.getAttribute("href");
        if (targetPath && targetPath !== "/lock-in") {
          const confirmQuit = window.confirm(
            "Don't exit, you are locked in! 🛑\n\nAre you sure you want to leave? Your active focus session will be lost.",
          );
          if (!confirmQuit) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    };
    document.addEventListener("click", handleNavigation, { capture: true });
    return () => {
      document.removeEventListener("click", handleNavigation, {
        capture: true,
      });
    };
  }, [isRunning]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue =
          "Don't exit, you are locked in! Your session progress will be lost.";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isRunning]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.ceil((endTimeRef.current - Date.now()) / 1000),
        );
        setTimeLeft(remaining);
        if (remaining <= 0) handleTimerComplete();
      }, 500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    if (audioRef.current)
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play blocked:", err));
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Lock In Complete! 🚀", {
        body: `You completed your focus target: ${focusText || "Your Task"}`,
        icon: "/vite.svg",
      });
    }
  };

  const startTimer = () => {
    const totalSecs = inputHours * 3600 + inputMinutes * 60;
    if (totalSecs <= 0) return;
    if (timeLeft <= 0) {
      setTimeLeft(totalSecs);
      setTotalTime(totalSecs);
      endTimeRef.current = Date.now() + totalSecs * 1000;
    } else {
      endTimeRef.current = Date.now() + timeLeft * 1000;
    }
    if ("Notification" in window && Notification.permission === "default")
      Notification.requestPermission();
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    if (isRunning) {
      const confirmReset = window.confirm(
        "Don't exit, you are locked in! 🛑\n\nAre you sure you want to reset this session?",
      );
      if (!confirmReset) return;
    }
    setIsRunning(false);
    const seconds = inputHours * 3600 + inputMinutes * 60;
    setTimeLeft(seconds);
    setTotalTime(seconds);
  };

  const handleHoursChange = (e) => {
    const val = Math.max(0, parseInt(e.target.value) || 0);
    setInputHours(val);
    if (!isRunning) {
      const seconds = val * 3600 + inputMinutes * 60;
      setTimeLeft(seconds);
      setTotalTime(seconds);
    }
  };

  const handleMinutesChange = (e) => {
    const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
    setInputMinutes(val);
    if (!isRunning) {
      const seconds = inputHours * 3600 + val * 60;
      setTimeLeft(seconds);
      setTotalTime(seconds);
    }
  };

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const pad = (num) => num.toString().padStart(2, "0");
    return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    totalTime > 0 ? circumference - (timeLeft / totalTime) * circumference : 0;

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />

      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-8 flex flex-col items-center transition-colors duration-300">
        <input
          type="text"
          placeholder="Set your singular focus..."
          value={focusText}
          onChange={(e) => setFocusText(e.target.value)}
          disabled={isRunning}
          className="w-full text-center text-xl font-bold bg-transparent border-b-2 border-slate-300 dark:border-slate-600 focus:border-emerald-500 outline-none py-2 mb-8 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50 transition-colors"
        />

        <div className="relative flex justify-center items-center mb-8">
          <svg className="transform -rotate-90 w-72 h-72 drop-shadow-lg">
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-200 dark:text-slate-700 transition-colors duration-300"
            />
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-emerald-500 transition-all duration-500 ease-linear"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-5xl font-mono font-bold text-slate-800 dark:text-slate-100 tracking-wider transition-colors duration-300">
            {formatTime(timeLeft)}
          </div>
        </div>

        {!isRunning && (
          <div className="flex items-center justify-center gap-6 mb-8 w-full">
            <div className="flex flex-col items-center w-24">
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                Hours
              </label>
              <input
                type="number"
                min="0"
                max="24"
                value={inputHours}
                onChange={handleHoursChange}
                className="w-full p-3 text-center text-xl font-mono bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
            <span className="text-3xl font-bold text-slate-400 dark:text-slate-600 self-end pb-3">
              :
            </span>
            <div className="flex flex-col items-center w-24">
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider font-semibold">
                Minutes
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={inputMinutes}
                onChange={handleMinutesChange}
                className="w-full p-3 text-center text-xl font-mono bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 w-full mt-2">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="flex-1 py-4 bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-emerald-500/30 dark:shadow-emerald-900/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {timeLeft < inputHours * 3600 + inputMinutes * 60
                ? "RESUME"
                : "START FOCUS"}
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-white dark:text-amber-950 rounded-xl font-bold tracking-wide shadow-lg shadow-amber-500/30 dark:shadow-amber-900/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              PAUSE
            </button>
          )}

          <button
            onClick={resetTimer}
            className="px-6 py-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-bold tracking-wide transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockIn;
