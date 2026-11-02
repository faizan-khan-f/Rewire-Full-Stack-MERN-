import { useMemo } from "react";

const quotes = [
  "Between stimulus and response there is a space. In that space is our power to choose our response. ",
  "Every action you take is a vote for the type of person you wish to become. ",
  "The curious paradox is that when I accept myself just as I am, then I can change. ",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. ",
  "The mind is everything. What you think you become.",
  "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
];

export default function RandomQuote() {
  const dailyQuote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    [],
  );

  return (
    <div className="w-full flex justify-center mb-6 pt-4">
      <p className="text-sm italic text-gray-400 text-center max-w-2xl px-4 border-l-2 border-emerald-500 py-1 bg-gray-800/30 rounded-r-md">
        "{dailyQuote}"
      </p>
    </div>
  );
}
