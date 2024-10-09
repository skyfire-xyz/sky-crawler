"use client";

export default function TopBar() {
  return (
    <div className="flex w-full items-center justify-between bg-black p-4 text-white dark:bg-gray-200 dark:text-black">
      <img src="/favicon.svg" alt="LearnerBot Logo" className="h-10 w-10" />
      <h1 className="ml-2 text-2xl font-bold text-gray-300 dark:text-gray-600">
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
