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
  inputPayment: string | null;
  ua: string | null;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  channelId,
  apiKey,
  inputDepth,
  inputPayment: inputCost,
  ua,
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
        ua: ua,
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
    <form className="flex w-5/12 items-center space-x-2">
      {" "}
      <div className="relative w-full">
        {" "}
        <input
          type="text"
          id="floating_outlined"
          className="border-1 peer block w-full appearance-none rounded-lg border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
          placeholder=" "
          required
          value={inputUrl}
          onChange={handleInputChange}
        />
        <label
          htmlFor="floating_outlined"
          className="absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4"
        >
          Website to crawl
        </label>
      </div>
      <button
        type="submit"
        className="rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <svg
            className="size-5 animate-spin"
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
            className="size-5"
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
