import React, { useState } from "react";
import DepthInput from "./DepthInput";

const SettingsBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [depth, setDepth] = useState<string | null>(null);
  const [isDepthDropdownOpen, setIsDepthDropdownOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDepthDropdownOpen(!isDepthDropdownOpen);
  };

  const handleDepthChange = (newDepth: string) => {
    setDepth(newDepth);
  };

  return (
    <div className="relative">
      <div className="text-center">
        <button
          type="button"
          className="mb-2 me-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          onClick={toggleDrawer}
        >
          Settings
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50"
          onClick={toggleDrawer}
        />
      )}

      {/* Drawer Component */}
      <div
        className={`fixed right-0 top-0 z-40 h-screen transform overflow-y-auto p-4 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } w-80 bg-white dark:bg-gray-800`}
        aria-labelledby="drawer-right-label"
      >
        <h5
          id="drawer-right-label"
          className="mb-4 inline-flex items-center text-base font-semibold text-gray-500 dark:text-gray-400"
        >
          <svg
            className="h-6 w-6 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4"
            />
          </svg>
          Crawl Settings
        </h5>
        <button
          type="button"
          onClick={toggleDrawer}
          className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            className="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Customize your settings here.
        </p>
        <button
          type="button"
          className="group flex w-full items-center rounded-lg p-2 text-base text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          onClick={toggleDropdown}
        >
          <span className="flex-1 whitespace-nowrap text-left rtl:text-right">
            Maximum Depth
          </span>
          <svg
            className={`h-3 w-3 transition-transform ${isDepthDropdownOpen ? "rotate-180" : "rotate-0"}`} // Rotate icon based on dropdown state
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        {isDepthDropdownOpen && (
          <ul className="space-y-2 py-2">
            <DepthInput onDepthChange={handleDepthChange} />
          </ul>
        )}
        <div className="grid grid-cols-2 gap-4"></div>
      </div>
    </div>
  );
};

export default SettingsBar;
