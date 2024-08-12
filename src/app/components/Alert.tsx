import React from "react";
import { AlertType } from "../types";

interface AlertProps {
  type: AlertType;
  message: string;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  let alertColor;
  switch (type) {
    case AlertType.INFO:
      alertColor = "blue";
      break;
    case AlertType.MISSING:
      alertColor = "yellow";
      break;
    case AlertType.INVALID:
    case AlertType.NETWORK:
      alertColor = "red";
      break;
  }

  return (
    <div
      className={`text- fixed right-4 top-4 mb-4 flex items-center p-4 text-sm${alertColor}-800 border- border${alertColor}-300 bg- rounded-lg${alertColor}-50 dark:text- dark:bg-gray-800${alertColor}-400 dark:border-${alertColor}-800`}
      role="alert"
    >
      <svg
        className="mr-3 inline size-4 shrink-0"
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
        className={`bg- -m-1.5 ml-auto inline-flex size-8 rounded-lg${alertColor}-50 text- p-1.5${alertColor}-800 hover:bg-${alertColor}-200 focus:ring- focus:ring-2${alertColor}-400 dark:text- dark:bg-gray-800${alertColor}-400 dark:hover:bg-gray-700`}
        aria-label="Close"
        onClick={onClose}
      >
        <span className="sr-only">Close</span>
        <svg className="size-3" fill="currentColor" viewBox="0 0 20 20">
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
