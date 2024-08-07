import React, { useState } from "react";
import axios from "axios";
import Alert from "./Alert";

const apiKey = process.env.NEXT_PUBLIC_SKYFIRE_API_KEY;

interface SearchBarProps {
  onSearch: () => void;
  channelId: string;
  apiKey: string | null;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  channelId,
  apiKey,
}) => {
  const [inputUrl, setInputValue] = useState("");
  const [alert, setAlert] = useState<{
    type: "missing" | "invalid";
    message: string;
  } | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    if (!apiKey) {
      setAlert({
        type: "missing",
        message: "Please fill out the API key field.",
      });
      return;
    }
    if (!inputUrl) {
      setAlert({
        type: "missing",
        message: "Please input a website to crawl.",
      });
      return;
    }

    setAlert(null);
    onSearch();
    console.log(`Input Value: ${inputUrl}`);
    const crawlerEndpoint = "http://localhost:3000/v1/crawler/start-crawl";
    try {
      const requestBody = {
        startUrl: inputUrl,
        channelId: channelId,
      };
      await axios.post(crawlerEndpoint, requestBody, {
        headers: {
          "skyfire-api-key": apiKey ?? "",
          "content-type": "application/json",
        },
      });
      // setAlert(null);
      // onSearch();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Handle specific Axios errors if needed
        setAlert({
          type: "invalid",
          message:
            "Error processing request. Please check your API key and try again.",
        });
      }
      console.error("Error processing payment:", err);
    }
  };

  return (
    <form className="flex w-2/3 items-center">
      <label htmlFor="simple-search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <svg
            className="size-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
            />
          </svg>
        </div>
        <input
          type="text"
          id="simple-search"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="Input website to crawl..."
          required
          value={inputUrl}
          onChange={handleInputChange}
        />
      </div>
      <button
        type="submit"
        className="ms-2 rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={handleButtonClick}
      >
        <svg
          className="size-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search</span>
      </button>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </form>
  );
};

export default SearchBar;
