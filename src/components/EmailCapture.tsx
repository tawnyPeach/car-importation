"use client";

import { useState } from "react";

export default function EmailCapture({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");

    // Store in localStorage as demo
    const existing = JSON.parse(localStorage.getItem("newsletter_subscribers") || "[]");
    existing.push({ email, date: new Date().toISOString() });
    localStorage.setItem("newsletter_subscribers", JSON.stringify(existing));

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={compact ? "text-center py-2" : "bg-white dark:bg-gray-800 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800 text-center"}>
        <p className="text-[#10b981] font-semibold">
          Thanks! You&apos;ll receive updates soon.
        </p>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 items-center">
        <span className="text-sm text-gray-400 mr-2">
          Get weekly import deals &amp; price updates
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10b981] w-full sm:w-auto"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white text-sm font-semibold rounded-lg transition whitespace-nowrap"
        >
          Subscribe
        </button>
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </form>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-md">
      <h3 className="text-lg font-bold text-[#1a1f36] dark:text-white mb-2">
        Get weekly import deals &amp; price updates
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Join thousands of car importers who get the best deals delivered to their inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#10b981] text-sm"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white font-semibold rounded-lg transition"
        >
          Subscribe
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
