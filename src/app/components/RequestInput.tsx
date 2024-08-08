import React, { useState } from "react";

interface RequestInputProps {
  onRequestChange: (maxRequest: string) => void;
}

const ApiInput: React.FC<RequestInputProps> = ({ onRequestChange }) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onRequestChange(event.target.value);
  };

  return (
    <form className="w-1/6">
      <label
        htmlFor="max requests"
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        Requests per Crawl
      </label>
      <div className="relative">
        <input
          type="search"
          id="default-search"
          value={inputValue}
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Max number of requests"
          required
        />
      </div>
    </form>
  );
};

export default ApiInput;
