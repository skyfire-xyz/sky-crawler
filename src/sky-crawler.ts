
import { PuppeteerCrawler } from "crawlee";
import { fetchRobotsTxt, isAllowedByRobotsTxt } from "./utils";
import { USER_AGENT } from "./types"

const crawler = new PuppeteerCrawler({
  async requestHandler({ request, page, enqueueLinks, log }) {
    log.info(`Processing ${request.url}...`);
    const data = await page.$$eval("body", () => ({
      title: document.title,
      url: location.href,
    }));
    console.log(data);

    const allLinks = await page.$$eval("a", (anchors) =>
      anchors.map((anchor) => anchor.href),
    );
    const allowedLinks = [];
    const robotsTxt = await fetchRobotsTxt(request.url);

    for (const link of allLinks) {
      if (isAllowedByRobotsTxt(robotsTxt, USER_AGENT, link)) {
        allowedLinks.push(link);
      } else {
        log.info(`Skipping ${link} due to robots.txt rules.`);
      }
    }

    await enqueueLinks({ urls: allowedLinks });
    // log.info(`Enqueued ${allowedLinks.length} allowed links.`);
  },

  failedRequestHandler({ request, log }) {
    log.error(`Request ${request.url} failed too many times.`);
  },
});

const startUrls = ["http://127.0.0.1:5500/example-website/"];
await crawler.addRequests(startUrls);
await crawler.run();
console.log("Crawler finished.");