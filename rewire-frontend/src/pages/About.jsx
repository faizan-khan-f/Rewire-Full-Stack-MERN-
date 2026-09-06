const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
          The Science Behind{" "}
          <span className="text-emerald-600 dark:text-emerald-400">
            Rewire.
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Modern digital culture and lifestyle is hijacking your dopamine
          pathways, trigger chronic cortisol spikes, and induce persistent brain
          fog and overwhelmed us. Rewire, Reset & Rebounce is built on
          behavioral neuroscience principles to help you break these loops
          permanently and regain coginitve control.We also have customized CBT
          and talk therapy sessions to help you with your mental health issues.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            1. The Reset
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            A 7-day intense dopamine baseline cleanse. Strict digital fasting
            clears mental fatigue and brings your cortisol back to a natural,
            regulated baseline.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            2. The Rewire
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Over 21 days, neuroplasticity takes effect. You actively identify
            behavioral loops, replace doomscrolling triggers, and build
            sustainable cognitive habits.
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            3. The Rebounce
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            A 90-day mastery framework. Integrate custom long-term goals, deep
            work routines, and life-long discipline to ensure permanent
            transformation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
