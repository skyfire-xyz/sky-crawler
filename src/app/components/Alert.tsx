import React from "react";

interface AlertProps {
  type: "missing" | "invalid";
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  let alertColor;
  switch (type) {
    case "missing":
      alertColor = "yellow";
      break;
    case "invalid":
      alertColor = "red";
      break;
    default:
      alertColor = "gray";
  }

  return (
    <div
      className={`fixed right-4 top-4 mb-4 flex items-center p-4 text-sm text-${alertColor}-800 border border-${alertColor}-300 rounded-lg bg-${alertColor}-50 dark:bg-gray-800 dark:text-${alertColor}-400 dark:border-${alertColor}-800`}
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
        className={`-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-${alertColor}-50 p-1.5 text-${alertColor}-800 hover:bg-${alertColor}-200 focus:ring-2 focus:ring-${alertColor}-400 dark:bg-gray-800 dark:text-${alertColor}-400 dark:hover:bg-gray-700`}
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
