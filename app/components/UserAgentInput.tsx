import React, { useState } from "react";

interface UAInputProps {
  onUAChange: (ua: string) => void;
}

const UAInput: React.FC<UAInputProps> = ({ onUAChange: onUAChange }) => {
  const [inputValue, setInputValue] = useState(
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onUAChange(event.target.value);
  };

  return (
    <form className="w-1/4">
      {" "}
      <div className="relative w-full">
        {" "}
        <input
          type="text"
          id="floating_outlined"
          className="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
          required
          value={inputValue}
          onChange={handleChange}
        />
        <label
          htmlFor="floating_outlined"
          className="absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          User-Agent
        </label>
      </div>
    </form>
  );
};

export default UAInput;
