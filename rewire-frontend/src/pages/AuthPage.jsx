import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import axios from "axios";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [successAnim, setSuccessAnim] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  // const API_URL = "http://localhost:5000/api/auth";
  const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

  const resetMessages = () => {
    setError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    try {
      if (mode === "login") {
        await login(email, password);
        setSuccessAnim(true);
        setTimeout(() => navigate("/dashboard"), 2500);
      } else if (mode === "signup") {
        await register(name, email, password);
        setSuccessAnim(true);
        setTimeout(() => navigate("/dashboard"), 2500);
      } else if (mode === "forgot") {
        const res = await axios.post(`${API_URL}/forgot-password`, { email });
        setSuccessMsg(res.data.message);
        setTimeout(() => {
          resetMessages();
          setMode("reset");
        }, 1500);
      } else if (mode === "reset") {
        const res = await axios.post(`${API_URL}/reset-password`, {
          email,
          newPassword,
        });
        setSuccessMsg(res.data.message);
        setTimeout(() => {
          setMode("login");
          resetMessages();
          setNewPassword("");
          setPassword("");
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Operation failed. Please verify your details.",
      );
    }
  };

  if (successAnim) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center animate-fade-in">
        <div className="p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-emerald-500/30 max-w-md w-full space-y-6 transform animate-scale-up">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 size={36} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome aboard!
            </h2>
            <p className="text-base text-emerald-600 dark:text-emerald-400 font-semibold leading-relaxed">
              Congrats, you took the first step towards a better life.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={12} />
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Get Started"}
            {mode === "forgot" && "Password Recovery"}
            {mode === "reset" && "Set New Password"}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === "login" && "Log in to your account"}
            {mode === "signup" && "Create your profile"}
            {mode === "forgot" && "Verify your email"}
            {mode === "reset" && "Choose a new password"}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={mode === "reset"}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white text-sm disabled:opacity-60"
            />
          </div>

          {(mode === "login" || mode === "signup") && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white text-sm"
              />
            </div>
          )}

          {mode === "reset" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white text-sm"
              />
            </div>
          )}

          {mode === "login" && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setMode("forgot");
                  resetMessages();
                }}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-emerald-600/20 text-sm"
          >
            <span>
              {mode === "login" && "Log In"}
              {mode === "signup" && "Create Account"}
              {mode === "forgot" && "Verify Email"}
              {mode === "reset" && "Reset Password"}
            </span>
            <ArrowRight size={18} className="ml-2" />
          </button>
        </form>

        <div className="mt-6 text-center space-y-2 flex flex-col">
          {mode === "login" && (
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                resetMessages();
              }}
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              Don't have an account? Sign up
            </button>
          )}
          {mode === "signup" && (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                resetMessages();
              }}
              className="text-sm font-medium text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
            >
              Already have an account? Log in
            </button>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                resetMessages();
              }}
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
