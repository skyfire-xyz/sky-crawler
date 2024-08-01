import { PuppeteerCrawler, Dataset } from "crawlee"
import {
  fetchRobotsTxt,
  parseRobotsTxt,
  filterAllowedLinks,
  processPayment,
  getRelativePath,
  normalizePath,
  verifyClaimReceived,
  saveHtmlToFile,
} from "./utils"

import WebSocket, { WebSocketServer } from 'ws'

const ws = new WebSocket('ws://localhost:8080');


const crawler = new PuppeteerCrawler({
  maxRequestsPerCrawl: 20,
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
    ws.send(`Crawling ${request.url}`)

    const title = await page.$eval(
      ".text-40.font-bold.leading-98.lg\\:text-80",
      (h1) => h1?.textContent?.trim() || "No title found",
    )

    const data = {
      title: title,
      url: request.url,
    }

    console.log(data)
    await Dataset.pushData(data)
    const html = await page.content()
    await saveHtmlToFile(html, request.url)

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

const startUrls = ["http://localhost:3001/"]
const robotsTxt = await fetchRobotsTxt(startUrls[0])
const robotsData = parseRobotsTxt(robotsTxt)
console.log(robotsData)
await crawler.addRequests(startUrls)

await crawler.run()

console.log(robotsData)
await Dataset.exportToCSV("output")
console.log("Crawler finished.")
ws.close()
