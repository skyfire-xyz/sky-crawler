import React, { useState } from "react";

interface ApiInputProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiInput: React.FC<ApiInputProps> = ({ onApiKeyChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onApiKeyChange(event.target.value);
  };

  return (
    <form className="w-1/3">
      <label
        htmlFor="api-key"
        className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        Submit
      </label>
      <div className="relative">
        <input
          type="search"
          id="default-search"
          value={inputValue}
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Input Skyfire API key..."
          required
        />
      </div>
    </form>
  );
};

export default ApiInput;
