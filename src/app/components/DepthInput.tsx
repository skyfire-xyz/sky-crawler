import React, { useState } from "react";
import { DEFAULT_DEPTH } from "../types";

interface DepthInputProps {
  onDepthChange: (inputDepth: string) => void;
}

const DepthInput: React.FC<DepthInputProps> = ({ onDepthChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setInputValue(value);
    if (!/^\d*$/.test(value)) {
      setError("Please enter a valid whole number.");
    } else if (parseInt(value, 10) > 5) {
      setError("Maximum allowed depth is 5.");
    } else {
      setError(null);

      if (value === "" || isNaN(Number(value))) {
        setInputValue("");
        onDepthChange("");
      } else {
        setInputValue(value);
        onDepthChange(value);
      }
    }
  };

  return (
    <form className="w-1/6">
      <label
        htmlFor="max-depth"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        <span className="group relative ml-1 mr-2 cursor-pointer text-blue-500">
          <svg
            className="inline size-4 shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="absolute bottom-full left-1/2 mb-2 hidden w-48 -translate-x-1/2 rounded-lg bg-gray-700 p-2 text-xs text-white shadow-md group-hover:block">
            This defines how many levels of links the crawler will follow from
            the start URL. For example, a depth of 1 means only the direct links
            from the start URL will be followed.
          </span>
        </span>
        Max Depth per Crawl
      </label>
      <div className="relative">
        <input
          type="text"
          id="max-depth"
          value={inputValue}
          onChange={handleChange}
          className={`block w-full rounded-lg border p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={`Default: ${DEFAULT_DEPTH}`}
          required
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>
    </form>
  );
};

export default DepthInput;
