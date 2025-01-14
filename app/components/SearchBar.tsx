import React, { useState } from "react";
import axios from "axios";
import Alert from "./Alert";
import { AlertType, AlertMessage } from "../types";
import { useSkyfireAPIKey } from "@/lib/skyfire-sdk/context/context";
import { Input } from "@/components/ui/input"

const backendURL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://api-qa.skyfire.xyz";

interface SearchBarProps {
  onSearch: () => void;
  channelId: string;
  inputDepth: string | null;
  inputPayment: string | null;
  ua: string | null;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  channelId,
  inputDepth,
  inputPayment: inputCost,
  ua,
}) => {
  const { localAPIKey, isReady } = useSkyfireAPIKey()
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
    if (!inputUrl) {
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
          "skyfire-api-key": localAPIKey,
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
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Website to crawl"
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
