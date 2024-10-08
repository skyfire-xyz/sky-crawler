"use client"; // Marks the component as a Client Component

import DarkModeToggle from "./DarkModeToggle";

export default function TopBar() {
  return (
    <div className="flex w-full items-center justify-between bg-black p-4 text-white dark:bg-gray-200 dark:text-black">
      <h1 className="text-2xl font-bold text-gray-300 dark:text-gray-600">
        LearnerBot
      </h1>

      <div className="ml-auto flex items-center">
        <div className="text-lg font-medium text-gray-300 dark:text-gray-600">
          Powered by Skyfire Payments
        </div>
      </div>
    </div>
  );
}
