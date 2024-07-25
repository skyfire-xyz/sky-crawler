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

// Parse robots.txt and check if a URL is allowed to be crawled
function isAllowedByRobotsTxt(
  robotsTxt: string,
  userAgent: string,
  url: string,
): boolean {
  if (!robotsTxt) {
    console.warn(
      `No robots.txt content, defaulting to allow all for URL: ${url}`,
    );
    return true; // Defaulting to allow all if robots.txt could not be fetched
  }

  const lines = robotsTxt.split("\n");
  let isDisallowed = false;
  let appliesToUserAgent = false;

  // Extract path from URL
  const parsedUrl = new URL(url);
  const fullPath = parsedUrl.pathname;

  // WHEN FINISHED TESTING, DELETE AND LET relativePath = fullPath
  const basePath = "/example-website";
  const relativePath = fullPath.startsWith(basePath)
    ? fullPath.substring(basePath.length)
    : fullPath;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith("User-agent:")) {
      const agent = trimmedLine.split(":")[1].trim();
      appliesToUserAgent = agent === "*" || agent === userAgent;
    } else if (appliesToUserAgent && trimmedLine.startsWith("Disallow:")) {
      const disallowedPath = trimmedLine.split(":")[1].trim();
      if (disallowedPath === "" || relativePath.startsWith(disallowedPath)) {
        console.log(
          `DISALLOWING ${url} due to rule: Disallow: ${disallowedPath}`,
        );
        isDisallowed = true;
        break;
      }
    }
  }
  return !isDisallowed;
}

const crawler = new PuppeteerCrawler({
  preNavigationHooks: [
    async (crawlingContext, gotoOptions) => {
      const { request } = crawlingContext;
      const robotsTxt = await fetchRobotsTxt(request.url);
      const isAllowed = isAllowedByRobotsTxt(
        robotsTxt,
        "sky-crawler",
        request.url,
      );
      if (!isAllowed) {
        console.log(`Skipping ${request.url} due to robots.txt rules.`);
        if (gotoOptions) {
          gotoOptions.timeout = 0; // Skip navigation
          gotoOptions.waitUntil = "domcontentloaded"; // Make sure navigation ends quickly
        }
        throw new Error(`BLOCKED by robots.txt`);
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
    const allowedLinks = [];
    const robotsTxt = await fetchRobotsTxt(request.url);

    for (const link of allLinks) {
      if (isAllowedByRobotsTxt(robotsTxt, userAgent, link)) {
        allowedLinks.push(link);
      } else {
        log.info(`Skipping ${link} due to robots.txt rules.`);
      }
    }

    await enqueueLinks({ urls: allowedLinks });
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
