import React, { useState } from "react";
import { DEFAULT_COST } from "../types";

interface CostInputProps {
  onCostChange: (inputCost: string) => void;
}

const CostInput: React.FC<CostInputProps> = ({ onCostChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    const validNumberRegex = /^[0-9]*\.?[0-9]*$/;
    if (value === "" || value === null || !validNumberRegex.test(value)) {
      setInputValue("");
      onCostChange("");
    } else {
      setInputValue(value);
      onCostChange(value);
    }
  };

  return (
    <form className="w-1/6">
      <label
        htmlFor="max-cost"
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
            This is the maximum amount the crawler will pay to access a specific
            folder or section of a website. It ensures the crawler doesn’t spend
            more than this limit when gathering information.
          </span>
        </span>
        Max Payment per Directory
      </label>
      <div className="relative">
        <input
          type="text"
          id="max-cost"
          value={inputValue}
          onChange={handleChange}
          className={`block w-full rounded-lg border p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={`Default: ${DEFAULT_COST} USD`}
          required
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>
    </form>
  );
};

export default CostInput;
