import React from "react";
import { AlertType } from "../types";

interface AlertProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  let alertStyles;
  switch (type) {
    case AlertType.INFO:
      alertStyles = {
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
        borderColor: "border-blue-300",
        darkBgColor: "dark:bg-gray-800",
        darkTextColor: "dark:text-blue-400",
        darkBorderColor: "dark:border-blue-800",
      };
      break;
    case AlertType.MISSING:
      alertStyles = {
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
        borderColor: "border-yellow-300",
        darkBgColor: "dark:bg-gray-800",
        darkTextColor: "dark:text-yellow-400",
        darkBorderColor: "dark:border-yellow-800",
      };
      break;
    case AlertType.INVALID:
    case AlertType.NETWORK:
      alertStyles = {
        bgColor: "bg-red-50",
        textColor: "text-red-800",
        borderColor: "border-red-300",
        darkBgColor: "dark:bg-gray-800",
        darkTextColor: "dark:text-red-400",
        darkBorderColor: "dark:border-red-800",
      };
      break;
    default:
      alertStyles = {
        bgColor: "bg-gray-50",
        textColor: "text-gray-800",
        borderColor: "border-gray-300",
        darkBgColor: "dark:bg-gray-800",
        darkTextColor: "dark:text-gray-400",
        darkBorderColor: "dark:border-gray-800",
      };
      break;
  }

  return (
    <div
      className={`fixed right-2 top-20 mb-4 flex items-center p-4 text-sm ${alertStyles.textColor} ${alertStyles.borderColor} rounded-lg ${alertStyles.bgColor} ${alertStyles.darkBgColor} ${alertStyles.darkTextColor} ${alertStyles.darkBorderColor}`}
      role="alert"
    >
      <svg
        className="mr-3 inline h-4 w-4 flex-shrink-0"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div>
        <span className="font-medium">{message}</span>
      </div>
      <button
        type="button"
        className={`-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg ${alertStyles.bgColor} p-1.5 ${alertStyles.textColor} hover:bg-${alertStyles.bgColor.replace(
          "50",
          "200",
        )} focus:ring-2 focus:ring-${alertStyles.textColor} ${alertStyles.darkBgColor} ${alertStyles.darkTextColor} dark:hover:bg-gray-700`}
        aria-label="Close"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;
