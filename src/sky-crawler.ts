import { PuppeteerCrawler } from "crawlee"
import {
  fetchRobotsTxt,
  parseRobotsTxt,
  filterAllowedLinks,
  processPayment,
  getRelativePath,
  normalizePath,
  verifyClaimReceived,
} from "./utils"

const crawler = new PuppeteerCrawler({
  async requestHandler({ request, page, enqueueLinks, log }) {
    const currPath = normalizePath(getRelativePath(request.url))
    const paidContent = Object.entries(robotsData.paidContentPaths).find(
      ([path]) => {
        return currPath.startsWith(normalizePath(path))
      },
    )

    if (paidContent) {
      const [path, { claimId }] = paidContent
      if (!claimId) {
        log.info(`Access to ${path} requires payment.`)
        await processPayment(path, robotsData)
        verifyClaimReceived(path, request.url, robotsData)
      } else {
        log.info(`Already paid for access to ${path}`)
      }
    }

    log.info(`Crawling ${request.url}`)
    const data = await page.$$eval("body", () => ({
      title: document.title,
      url: location.href,
    }))
    console.log(data)

    const allLinks = await page.$$eval("a", (anchors) =>
      anchors.map((anchor) => anchor.href),
    )

    const allowedLinks = filterAllowedLinks(allLinks, robotsData)
    await enqueueLinks({ urls: allowedLinks })
  },

  failedRequestHandler({ request, log }) {
    log.error(`Request ${request.url} failed too many times.`)
  },
})

const startUrls = ["http://127.0.0.1:5500/example-website/"]
const robotsTxt = await fetchRobotsTxt(startUrls[0])
const robotsData = parseRobotsTxt(robotsTxt)
console.log(robotsData)
await crawler.addRequests(startUrls)

await crawler.run()

console.log(robotsData)
console.log("Crawler finished.")
