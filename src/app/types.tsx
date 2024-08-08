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

export enum AlertMessages {
  MISSING_API = "Please fill out the API key field.",
  MISSING_URL = "Please input a website to crawl.",
  INVALID_API = "Error processing request. Please check your API key and try again.",
}
