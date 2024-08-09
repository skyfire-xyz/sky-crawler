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
        Max Payment per Directory
      </label>
      <div className="relative">
        <input
          type="text"
          id="max-cost"
          value={inputValue}
          onChange={handleChange}
          className={`block w-full rounded-lg border p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
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
