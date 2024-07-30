import axios from "axios";
import dotenv from 'dotenv';

import { RobotsTxtData, USER_AGENT } from "./types";

dotenv.config();
const apiKey = process.env.CRAWLER_API_KEY!;

const robotsTxtCache: { [domain: string]: string } = {};

export function getRelativePath(path: string): string {
  const parsedPath = new URL(path);
  return parsedPath.pathname;
}

// Fetch and return the content of robots.txt
export async function fetchRobotsTxt(path: string): Promise<string> {
  const domain = new URL(path).origin;
  if (robotsTxtCache[domain]) {
    return robotsTxtCache[domain];
  }

  try {
    const response = await axios.get(`${domain}/robots.txt`);
    const robotsTxt = response.data;
    console.log(`Fetched robots.txt\n${robotsTxt}`);
    robotsTxtCache[domain] = robotsTxt;
    return robotsTxt;
  } catch (error) {
    console.error(`Error fetching robots.txt from ${domain}:`, error);
    robotsTxtCache[domain] = ""; // Cache empty response to avoid repeated requests
    return "";
  }
}

export function parseRobotsTxt(robotsTxt: string): RobotsTxtData {
  const data: RobotsTxtData = {
    paymentUrl: "",
    siteUsername: "",
    disallowedPaths: new Set(),
    paidContentPaths: {},
  };

  const lines = robotsTxt.split("\n");
  let appliesToUserAgent = false;

  for (const line of lines) {
    const [directive, info] = line
      .trim()
      .split(/:(.+)/)
      .map((part) => part.trim());

    switch (directive.toLowerCase()) {
      case "payment-url":
        data.paymentUrl = info;
        break;
      case "site-username":
        data.siteUsername = info;
        break;
      case "user-agent":
        appliesToUserAgent = info === "*" || info === USER_AGENT;
        break;
      case "disallow":
        if (appliesToUserAgent) {
          data.disallowedPaths.add(normalizePath(info));
        }
        break;
      case "paid-content":
        const [path, price] = info.split(",").map((part) => part.trim());
        data.paidContentPaths[normalizePath(path)] = {
          claimId: "",
          price: price,
        };

        break;
      default:
        break;
    }
  }
  return data;
}

export function isAllowedByRobotsTxt(
  robotsData: RobotsTxtData,
  path: string,
): boolean {
  const relativePath = normalizePath(getRelativePath(path));
  for (const disallowedPath of robotsData.disallowedPaths) {
    if (relativePath.startsWith(normalizePath(disallowedPath))) {
      return false;
    }
  }
  return true; // If no specific rules, assume allowed
}

export async function processPayment(
  path: string,
  robotsData: RobotsTxtData,
) {
  try {
    const requestBody = {
      receiverUsername: robotsData.siteUsername,
      amount: parseInt(robotsData.paidContentPaths[path].price, 10),
    };
    const response = await axios.post(robotsData.paymentUrl, requestBody, {
      headers: {
        'skyfire-api-key': apiKey,
        'content-type': 'application/json'
      }
    });
    const claimId = response.data;
    robotsData.paidContentPaths[path].claimId = claimId;
  } catch (error) {
    console.error(`Payment failed for ${path}:`, error);
  }
}

export function isEmptyString(str: string): boolean {
  return str.trim().length === 0;
}

export function normalizePath(path: string): string {
  return path.endsWith("/") ? path : `${path}/`;
}
