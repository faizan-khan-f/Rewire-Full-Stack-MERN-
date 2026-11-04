// // const Home = () => {
// //   return (
// //     <div className="p-8 text-2xl font-bold">
// //       <h2>Welcome to Rewire, Reset & Rebounce </h2>
// //     </div>
// //   );
// // };
// // export default Home;
// import { Link } from "react-router-dom";
// import { ArrowRight, Sparkles } from "lucide-react";
// import { Navigate } from "react-router-dom";
// // Import your auth hook (adjust the path to match your project)
// // import { useAuth } from '../context/AuthContext';
// import { useContext } from "react";
// // IMPORTANT: Update this import path to point exactly to your AuthContext file
// import { AuthContext } from "../context/AuthContext";

// const Home = () => {
//   // const isLoggedIn = Boolean(localStorage.getItem("token"));

//   // // 2. The Intercept: If logged in, send them straight to the dashboard
//   // if (isLoggedIn) {
//   //   return <Navigate to="/dashboard" replace />;
//   // // }

//   // 1. Pull the user state directly from your AuthContext
//   const { user } = useContext(AuthContext);

//   // 2. Debugging log (Check your browser console (F12) to see what this prints)
//   // console.log("Current user state in Home:", user);

//   // 3. The Redirect: If the user object exists, send them to the dashboard
//   if (user) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return (
//     <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 text-center space-y-12 animate-fade-in">
//       {/* Hero Section */}
//       <div className="space-y-6 max-w-3xl">
//         <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
//           <Sparkles size={14} /> Neuroplasticity & Dopamine Reset Protocol
//         </div>

//         <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
//           Master Your Mind.{" "}
//           <span className="text-emerald-600 dark:text-emerald-400">
//             Rewire, Reset & Rebounce.
//           </span>
//         </h1>
//         <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
//           Are You feel stuck ? Lost ? Dont worry
//         </h2>

//         <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
//           Get ready to embark on a transformative journey with Rewire built from
//           pshychologists and experts suggestions. Break free from constant
//           digital overstimulation, clear chronic brain fog,emotional ehaustion
//           and optimize your cortisol levels. One to one from CBT or talk therapy
//           . Progress through our structured progressive task suggestions from
//           the 1-week dopamine detox to lifelong behavioral mastery.
//         </p>
//         <p className="text-lg md:text-2xl text-gray-500 ">
//           {" "}
//           Features like track your daily ,weekly and monthly target &
//           goals.Additionally a note to record or plan your goals.
//         </p>
//       </div>

//       {/* Core Pillars Preview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
//         <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
//           <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center font-bold mb-4">
//             1
//           </div>
//           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
//             Reset (1 Week)
//           </h3>
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Strict digital fasting, mindfulness, and dopamine baseline resetting
//             to clear cognitive fatigue.
//           </p>
//         </div>

//         <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
//           <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center font-bold mb-4">
//             2
//           </div>
//           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
//             Reset & Rewire (21 Days)
//           </h3>
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Break negative habit loops, build new neural pathways, and track
//             daily behavioral progress.
//           </p>
//         </div>

//         <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
//           <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center font-bold mb-4">
//             3
//           </div>
//           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
//             Rebounce (3 Months)
//           </h3>
//           <p className="text-sm text-gray-600 dark:text-gray-400">
//             Total lifestyle transformation with deep work routines and custom
//             long-term goal tracking.
//           </p>
//         </div>
//       </div>

//       {/* Login/Signup Arrow CTA at the Bottom */}
//       <div className="pt-6">
//         <Link
//           to="/login"
//           className="group inline-flex items-center px-8 py-4 text-base font-bold text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-95"
//         >
//           <span>Login / Signup to Begin Challenge</span>
//           <ArrowRight
//             size={20}
//             className="ml-3 group-hover:translate-x-1.5 transition-transform"
//           />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Home;
import { Link, Navigate } from "react-router-dom";
import { ArrowRight, Sparkles, Bot } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4 text-center space-y-12 animate-fade-in">
      {/* Hero Section */}
      <div className="space-y-6 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles size={14} /> Neuroplasticity & Dopamine Reset Protocol
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Master Your Mind.{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            Rewire, Reset & Rebounce.
          </span>
        </h1>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
          Feeling stuck? Lost? Don't worry.
        </h2>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          Get ready to embark on a transformative journey with Rewire, built
          from psychologists' and experts' suggestions. Break free from constant
          digital overstimulation, clear chronic brain fog, emotional
          exhaustion, optimize your cortisol levels and mild disorders.
        </p>
        <p className="text-md md:text-xl text-gray-500">
          Track your daily, weekly, and monthly targets & goals and plan
          strategy notes. Additionally use LockIn feature to complete daily
          targets.
        </p>
      </div>

      {/* --- MEET SPIDEY AI SECTION --- */}
      <div className="max-w-4xl w-full bg-gradient-to-br from-white to-emerald-50/50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 md:p-10 border border-emerald-200 dark:border-emerald-500/30 shadow-xl dark:shadow-2xl relative overflow-hidden text-left flex flex-col md:flex-row items-center gap-8 my-8 transition-colors duration-300">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/20 blur-3xl rounded-full pointer-events-none transition-colors duration-300"></div>

        {/* Animated Spidey Avatar */}
        <div className="relative flex-shrink-0 mt-4 md:mt-0">
          <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 dark:opacity-30 animate-pulse rounded-full transition-opacity duration-300"></div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-full border-2 border-emerald-500 relative z-10 animate-bounce shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-colors duration-300">
            <Bot
              size={48}
              className="text-emerald-500 dark:text-emerald-400 transition-colors duration-300"
            />
          </div>
          {/* Online Ping */}
          <span className="absolute top-2 right-2 flex h-4 w-4 z-20">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
          </span>
        </div>

        {/* Text Content */}
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 transition-colors duration-300">
            <Sparkles size={12} /> Meet Your AI Clinical Coach
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
            Guided by{" "}
            <span className="text-emerald-600 dark:text-emerald-400">
              Spidey
            </span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed transition-colors duration-300">
            Don't know where to start? Spidey is our empathetic, AI-powered
            behavioral coach. Tell Spidey your specific hurdles—whether it's
            anxiety, doomscrolling, or procrastination—and he will weave a
            highly personalized, scientifically-grounded daily protocol just for
            you.
          </p>
        </div>
      </div>
      {/* --- END SPIDEY SECTION --- */}

      {/* Core Pillars Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full text-left">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center font-bold mb-4">
            1
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Reset (1 Week)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Strict digital fasting, mindfulness, and dopamine baseline resetting
            to clear cognitive fatigue.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center font-bold mb-4">
            2
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Reset & Rewire (21 Days)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Break negative habit loops, build new neural pathways, and track
            daily behavioral progress.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:-translate-y-1">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center font-bold mb-4">
            3
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Rebounce (3 Months)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total lifestyle transformation with deep work routines and custom
            long-term goal tracking.
          </p>
        </div>
      </div>

      {/* Login/Signup Arrow CTA at the Bottom */}
      <div className="pt-6">
        <Link
          to="/login"
          className="group inline-flex items-center px-8 py-4 text-base font-bold text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/20 active:scale-95"
        >
          <span>Login / Signup to Begin Challenge</span>
          <ArrowRight
            size={20}
            className="ml-3 group-hover:translate-x-1.5 transition-transform"
          />
        </Link>
      </div>
    </div>
  );
};

export default Home;
