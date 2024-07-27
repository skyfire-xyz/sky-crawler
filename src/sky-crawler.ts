import { PuppeteerCrawler } from "crawlee";
import {
  fetchRobotsTxt,
  parseRobotsTxt,
  isAllowedByRobotsTxt,
  processPayment,
  getRelativePath,
  isEmptyString,
} from "./utils";

const crawler = new PuppeteerCrawler({
  async requestHandler({ request, page, enqueueLinks, log }) {
    const currRelativePath = getRelativePath(request.url);
    let isPaidContent = false;
    let paidContentPath = "";

    for (const [path, claimId] of Object.entries(robotsData.paidContentPaths)) {
      if (currRelativePath.startsWith(path)) {
        isPaidContent = true;
        paidContentPath = path;
        if (isEmptyString(claimId)) {
          await processPayment(path, robotsData.paymentUrl, robotsData);
        } else {
          log.info(`Already paid for access to ${path}`);
        }
      }
    }

    if (
      (isPaidContent && robotsData.paidContentPaths[paidContentPath]) ||
      isAllowedByRobotsTxt(robotsData, request.url)
    ) {
      log.info(`Processing ${request.url}...`);
      if (isPaidContent) {
        log.info(`Crawling with claimId: ${robotsData.paidContentPaths[paidContentPath]}`)
      }
      const data = await page.$$eval("body", () => ({
        title: document.title,
        url: location.href,
      }));
      console.log(data);

      const allLinks = await page.$$eval("a", (anchors) =>
        anchors.map((anchor) => anchor.href),
      );

      const allowedLinks: string[] = [];
      for (const link of allLinks) {
        if (isAllowedByRobotsTxt(robotsData, link)) {
          allowedLinks.push(link);
        }
      }

      await enqueueLinks({ urls: allowedLinks });
      // log.info(`Enqueued ${allowedLinks.length} allowed links.`)
    }
  },

  failedRequestHandler({ request, log }) {
    log.error(`Request ${request.url} failed too many times.`);
  },
});

const startUrls = ["http://127.0.0.1:5500/example-website/"];
const robotsTxt = await fetchRobotsTxt(startUrls[0]);
const robotsData = parseRobotsTxt(robotsTxt);
console.log(robotsData);

await crawler.addRequests(startUrls);
await crawler.run();
console.log(robotsData);

console.log("Crawler finished.");
