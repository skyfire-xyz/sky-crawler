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
}

export enum AlertMessage {
  MISSING_API = "Please fill out the API key field.",
  MISSING_URL = "Please input a website to crawl.",
  INVALID_API = "Error processing request. Please check your API key and try again.",
}
