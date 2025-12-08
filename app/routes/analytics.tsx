import AnalyticsIcon from "../assets/analytics.svg";
import React from "react";

export function meta() {
  return [
    { title: "Vecno Analytics - Network Stats & Charts | Vecnoscan" },
    {
      name: "description",
      content:
        "Analyze the Vecno blockchain with real-time charts and statistics. Track block production, hash rate, difficulty, and network growth.",
    },
    {
      name: "keywords",
      content: "Vecno analytics, blockchain stats, network charts, hash rate, difficulty, block time",
    },
  ];
}

export default function Analytics() {
  return (
    <div className="flex w-full max-w-300 flex-col items-center rounded-4xl bg-white py-12 sm:py-24">
      <AnalyticsIcon className="h-22 w-22" />
      <div className="mt-4 mb-6 flex flex-col items-center justify-center">
        <div className="text-xl font-medium">Analytics - Coming Soon</div>
        <div>We're building a powerful Analytics page to bring deeper insights into the Vecno network.</div>
      </div>
    </div>
  );
}
