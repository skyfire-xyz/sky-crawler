import axios from "axios";

const robotsTxtCache: { [domain: string]: string } = {};

// Fetch and return the content of robots.txt
export async function fetchRobotsTxt(url: string): Promise<string> {
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


export function parseRobotsTxtLine(
    line: string,
    userAgent: string,
    relativePath: string,
    appliesToUserAgent: boolean,
  ): {
    isAllowed: boolean;
    isPaidContent: boolean;
  } {
    const trimmedLine = line.trim();
    let isAllowed = true;
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
          isAllowed = false;
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
  
    return { isAllowed, isPaidContent };
  }

  // function isAllowedByRobotsTxt(
  //   robotsTxt: string,
  //   userAgent: string,
  //   url: string,
  // ): { allowed: boolean; isPaidContent: boolean; paidContentPaths: string[] } {
  //   if (!robotsTxt) {
  //     console.warn(
  //       `No robots.txt content, defaulting to allow all for URL: ${url}`,
  //     );
  //     return { allowed: true, isPaidContent: false, paidContentPaths: [] }; // Defaulting to allow all if robots.txt could not be fetched
  //   }
  
  //   const lines = robotsTxt.split("\n");
  //   let isDisallowed = false;
  //   let appliesToUserAgent = false;
  //   let isPaidContent = false;
  //   const paidContentPaths: string[] = [];
  
  //   const parsedUrl = new URL(url);
  //   const fullPath = parsedUrl.pathname;
  //   const basePath = "/example-website"; // WHEN FINISHED TESTING, DELETE AND LET relativePath = fullPath
  //   const relativePath = fullPath.startsWith(basePath)
  //     ? fullPath.substring(basePath.length)
  //     : fullPath;
  
  //   for (const line of lines) {
  //     const result = parseRobotsTxtLine(
  //       line,
  //       userAgent,
  //       relativePath,
  //       appliesToUserAgent,
  //     );
  //     appliesToUserAgent = result.appliesToUserAgent;
  //     isPaidContent = result.isPaidContent || isPaidContent;
  //     if (result.isPaidContent) {
  //       paidContentPaths.push(relativePath);
  //     }
  //     if (result.isDisallowed) {
  //       isDisallowed = true;
  //       break;
  //     }
  //   }
  
  //   return { allowed: !isDisallowed, isPaidContent, paidContentPaths };
  // }



// Parse robots.txt and check if a URL is allowed to be crawled
export function isAllowedByRobotsTxt(
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


