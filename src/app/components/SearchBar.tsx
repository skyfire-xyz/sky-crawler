import React, { useState } from "react";
import axios from "axios";
import Alert from "./Alert";
import { AlertType, AlertMessage } from "../types";

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://api-qa.skyfire.xyz";

interface SearchBarProps {
  onSearch: () => void;
  channelId: string;
  apiKey: string | null;
  inputDepth: string | null;
  inputCost: string | null;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  channelId,
  apiKey,
  inputDepth,
  inputCost,
}) => {
  const [inputUrl, setInputUrl] = useState("https://skyfire.xyz/");
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(event.target.value);
  };

  const handleButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setAlert(null);
    if (!apiKey) {
      setAlert({
        type: AlertType.MISSING,
        message: AlertMessage.MISSING_API,
      });
      return;
    } else if (!inputUrl) {
      setAlert({
        type: AlertType.MISSING,
        message: AlertMessage.MISSING_URL,
      });
      return;
    } else {
      setAlert(null);
    }
    setIsLoading(true);
    onSearch();
    setAlert({
      type: AlertType.INFO,
      message: AlertMessage.START_CRAWL,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
    console.log(`Input Value: ${inputUrl}`);
    const crawlerEndpoint = backendURL + "/v1/crawler/start-crawl";
    try {
      const requestBody = {
        startUrl: inputUrl,
        channelId: channelId,
        ...(inputCost !== "" && { inputCost: Number(inputCost) }),
        ...(inputDepth !== "" && { inputDepth: Number(inputDepth) }),
      };
      console.log(requestBody);
      await axios.post(crawlerEndpoint, requestBody, {
        headers: {
          "skyfire-api-key": apiKey,
          "content-type": "application/json",
        },
      });
      setAlert(null);
    } catch (err) {
      setAlert(null);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setAlert({
            type: AlertType.INVALID,
            message: AlertMessage.INVALID_API,
          });
          return;
        } else if (err.message === "Network Error") {
          setAlert({
            type: AlertType.NETWORK,
            message: AlertMessage.BACKEND_DOWN,
          });
          return;
        } else {
          setAlert({
            type: AlertType.INVALID,
            message: err.message,
          });
          return;
        }
      }
      console.error("Error processing payment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex w-5/12 flex-col">
      <div className="mb-5">
        <label
          htmlFor="simple-search"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Website to crawl
        </label>
        <div className="flex w-full items-center space-x-2">
          <div className="relative flex-1">
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
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Website to crawl"
              required
              value={inputUrl}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleButtonClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="size-4 animate-spin"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
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
            )}
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>

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
