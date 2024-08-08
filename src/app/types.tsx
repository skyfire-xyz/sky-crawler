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

export enum AlertMessage {
  MISSING_API = "Please enter an API key and try again.",
  MISSING_URL = "Please input a valid URL and try again.",
  INVALID_API = "Error processing request. Please check your API key and try again.",
  BACKEND_DOWN = "Unable to reach the server. Please check your connection and try again",
  DEFAULT_REQUEST = "No maximum request specified. Defaulting to 10 requests.",
}
