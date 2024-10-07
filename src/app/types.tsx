export const DEFAULT_DEPTH = "2";
export const DEFAULT_PAYMENT = "0.01";

export interface MessageData {
  type: string;
  title: string;
  url: string;
  text: string;
  paid: string;
  char: string;
  time: string;

  amount: string;
  senderUsername: string;
  receiverUsername: string;
  path: string;
}

export enum AlertType {
  MISSING = "missing",
  INVALID = "invalid",
  INFO = "info",
  NETWORK = "network",
}

export const AlertMessage = {
  MISSING_API: "Please enter an API key and try again.",
  MISSING_URL: "Please input a valid URL and try again.",
  INVALID_API:
    "Error processing request. Please check your API key and try again.",
  BACKEND_DOWN:
    "Unable to reach the server. Please check your connection and try again",
  START_CRAWL: "Hang on tight! Crawl starting...",
} as const;

export type AlertMessageType = keyof typeof AlertMessage;
