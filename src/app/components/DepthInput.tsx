import React, { useState } from "react";

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
        Depth per Crawl
      </label>
      <div className="relative">
        <input
          type="text"
          id="max-depth"
          value={inputValue}
          onChange={handleChange}
          className={`block w-full rounded-lg border p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Max depth per crawl"
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
