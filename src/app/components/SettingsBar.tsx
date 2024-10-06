import React, { useState } from "react";

const SettingsBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSettingsBar = () => {
    setIsOpen(!isOpen);
    // if (!isOpen) {
    //   document.body.style.overflow = "hidden";
    // } else {
    //   document.body.style.overflow = "auto";
    // }
  };

  return (
    <>
      {/* Button to show the settings bar */}
      <div className="text-center">
        <button
          className="mb-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
          onClick={toggleSettingsBar}
        >
          Toggle Settings
        </button>
      </div>

      {/* Settings Bar */}
      <div
        id="settings-bar"
        className={`fixed right-0 top-0 z-40 h-screen w-64 transform bg-white p-4 shadow-lg transition-transform dark:bg-gray-800 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-labelledby="settings-bar-label"
        style={{ transition: "transform 0.3s ease-in-out" }} // Smooth transition
      >
        <h5
          id="settings-bar-label"
          className="text-base font-semibold uppercase text-gray-500 dark:text-gray-400"
        >
          Settings
        </h5>
        <button
          type="button"
          className="absolute right-2.5 top-3 inline-flex items-center rounded-lg p-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:hover:bg-gray-700 dark:hover:text-white"
          onClick={toggleSettingsBar}
        >
          <span className="sr-only">Close settings</span>
          {/* Close icon (You can use an icon or just "X") */}X
        </button>
        <ul className="mt-6 space-y-2">
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Setting 1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Setting 2
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Setting 3
            </a>
          </li>
        </ul>
      </div>

      {/* Backdrop for dimming effect */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={toggleSettingsBar} // Close settings on clicking backdrop
        />
      )}
    </>
  );
};

export default SettingsBar;
