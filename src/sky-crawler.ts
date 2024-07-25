import { BatchAddRequestsResult } from "@crawlee/types";
import axios from "axios";
import { PuppeteerCrawler } from "crawlee";

const robotsTxtCache: { [domain: string]: string } = {};

// Fetch and return the content of robots.txt
async function fetchRobotsTxt(url: string): Promise<string> {
  // const domain = new URL(url).origin  USE THIS WHEN NOT TESTING
  const domain = "http://127.0.0.1:5500/example-website/";
  if (robotsTxtCache[domain]) {
    return robotsTxtCache[domain];
  }

  try {
    const response = await axios.get(`${domain}/robots.txt`);
    const robotsTxt = response.data;
    console.log(`FETCHED ROBOTS.TXT ${robotsTxt}`);
    robotsTxtCache[domain] = robotsTxt;
    return robotsTxt;
  } catch (error) {
    console.error(`Error fetching robots.txt from ${domain}:`, error);
    robotsTxtCache[domain] = ""; // Cache empty response to avoid repeated requests
    return "";
  }
}

// Parse a single line of robots.txt
function parseRobotsTxtLine(
  line: string,
  userAgent: string,
  relativePath: string,
  appliesToUserAgent: boolean,
): {
  appliesToUserAgent: boolean;
  isDisallowed: boolean;
  isPaidContent: boolean;
} {
  const trimmedLine = line.trim();
  let isDisallowed = false;
  let isPaidContent = false;

  const [directive, value] = trimmedLine.split(":").map((part) => part.trim());

  switch (directive.toLowerCase()) {
    case "user-agent":
      appliesToUserAgent = value === "*" || value === userAgent;
      break;
    case "disallow":
      if (
        appliesToUserAgent &&
        (value === "" || relativePath.startsWith(value))
      ) {
        isDisallowed = true;
      }
      break;
    case "paid-content":
      if (
        appliesToUserAgent &&
        (value === "" || relativePath.startsWith(value))
      ) {
        console.log(`PAID CONTENT detected: ${value}`);
        isPaidContent = true;
      }
      break;
    default:
      break;
  }

  return { appliesToUserAgent, isDisallowed, isPaidContent };
}

// Check if a URL is allowed to be crawled
function isAllowedByRobotsTxt(
  robotsTxt: string,
  userAgent: string,
  url: string,
): { allowed: boolean; isPaidContent: boolean; paidContentPaths: string[] } {
  if (!robotsTxt) {
    console.warn(
      `No robots.txt content, defaulting to allow all for URL: ${url}`,
    );
    return { allowed: true, isPaidContent: false, paidContentPaths: [] }; // Defaulting to allow all if robots.txt could not be fetched
  }

  const lines = robotsTxt.split("\n");
  let isDisallowed = false;
  let appliesToUserAgent = false;
  let isPaidContent = false;
  const paidContentPaths: string[] = [];

  const parsedUrl = new URL(url);
  const fullPath = parsedUrl.pathname;
  const basePath = "/example-website"; // WHEN FINISHED TESTING, DELETE AND LET relativePath = fullPath
  const relativePath = fullPath.startsWith(basePath)
    ? fullPath.substring(basePath.length)
    : fullPath;

  for (const line of lines) {
    const result = parseRobotsTxtLine(
      line,
      userAgent,
      relativePath,
      appliesToUserAgent,
    );
    appliesToUserAgent = result.appliesToUserAgent;
    isPaidContent = result.isPaidContent || isPaidContent;
    if (result.isPaidContent) {
      paidContentPaths.push(relativePath);
    }
    if (result.isDisallowed) {
      isDisallowed = true;
      break;
    }
  }

  return { allowed: !isDisallowed, isPaidContent, paidContentPaths };
}

// Function to simulate payment action
async function processPayment(contentPath: string, paymentEndpoint: string) {
  console.log(
    `Processing payment for access to ${contentPath} at ${paymentEndpoint}`,
  );
  // Simulate hitting the payment endpoint
  // try {
  //   await axios.post(paymentEndpoint, { contentPath });
  //   console.log(`Payment processed for ${contentPath}`);
  // } catch (error) {
  //   console.error(`Payment failed for ${contentPath}:`, error);
  // }
}

const crawler = new PuppeteerCrawler({
  preNavigationHooks: [
    async (crawlingContext, gotoOptions) => {
      const { request } = crawlingContext;
      const robotsTxt = await fetchRobotsTxt(request.url);
      const { allowed, isPaidContent, paidContentPaths } = isAllowedByRobotsTxt(
        robotsTxt,
        "sky-crawler",
        request.url,
      );
      if (!allowed) {
        console.log(`Skipping ${request.url} due to robots.txt rules.`);
        if (gotoOptions) {
          gotoOptions.timeout = 0; // Skip navigation
          gotoOptions.waitUntil = "domcontentloaded"; // Make sure navigation ends quickly
        }
        throw new Error(`BLOCKED by robots.txt`);
      }
      if (isPaidContent) {
        const paymentEndpoint = "http://www.skyfire.xyz/payment"; // Use the actual payment endpoint
        for (const path of paidContentPaths) {
          await processPayment(path, paymentEndpoint);
        }
      }
    },
  ],

  async requestHandler({ request, page, enqueueLinks, log }) {
    log.info(`Processing ${request.url}...`);
    const data = await page.$$eval("body", () => ({
      title: document.title,
      url: location.href,
    }));
    console.log(data);

    // Extract all links from the page
    const allLinks = await page.$$eval("a", (anchors) =>
      anchors.map((anchor) => anchor.href),
    );
    const userAgent = "sky-crawler";
    const robotsTxt = await fetchRobotsTxt(request.url);

    const allowedLinks = allLinks.filter((link) => {
      const { allowed, isPaidContent, paidContentPaths } = isAllowedByRobotsTxt(
        robotsTxt,
        userAgent,
        link,
      );
      if (isPaidContent) {
        const paymentEndpoint = "http://www.skyfire.xyz/payment"; // Use the actual payment endpoint
        for (const path of paidContentPaths) {
          processPayment(path, paymentEndpoint);
        }
      }
      return allowed;
    });

    // Log and enqueue the filtered links
    allowedLinks.forEach((link) =>
      log.info(`Enqueuing ${link} due to robots.txt rules.`),
    );

    await enqueueLinks({
      urls: allowedLinks,
    });

    log.info(`Enqueued ${allowedLinks.length} allowed links.`);
  },

  failedRequestHandler({ request, log }) {
    log.error(`Request ${request.url} failed too many times.`);
  },
});

const startUrls = ["http://127.0.0.1:5500/example-website/"];
await crawler.addRequests(startUrls);
await crawler.run();
console.log("Crawler finished.");
