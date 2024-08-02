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
  maxRequestsPerCrawl: 100,
  async requestHandler({ request, page, enqueueLinks, log }) {
    const currPath = normalizePath(getRelativePath(request.url))
    const paidContent = Object.entries(robotsData.paidContentPaths).find(
      ([path]) => {
        return currPath.startsWith(normalizePath(path))
      },
    )

    if (paidContent) {
      const [path, { claimId, price }] = paidContent
      if (!claimId) {
        log.info(`Access to ${path} requires payment.`)
        await processPayment(path, robotsData)
        const isReceived = verifyClaimReceived(path, request.url, robotsData)
        if (!isReceived) {
          ws.send(`Payment for access to ${path} failed. Skipping ${request.url}`)
          return
        }
        ws.send(`Paid ${price} USDC for access to ${path} with claimId = ${robotsData.paidContentPaths[path].claimId}`)
      } else {
        log.info(`Already paid for access to ${path}`)
      }
    }

    log.info(`Crawling ${request.url}`)
    ws.send(`Crawling ${request.url}`)

    let title
    try {
      title = await page.$eval(
        ".text-40.font-bold.leading-98.lg\\:text-80",
        (h1) => h1?.textContent?.trim()
      )
    } catch (e) {
      title = "No title found"
    }
   
    const textContent = await page.$eval('body', (element) => element.innerText);

    const data = {
      title: title,
      text: textContent,
      url: request.url,
    }

    // console.log(data)
    ws.send(JSON.stringify(data, null, 2))
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

const startUrls = ["http://localhost:3002/"]
const robotsTxt = await fetchRobotsTxt(startUrls[0])
const robotsData = parseRobotsTxt(robotsTxt)
console.log(robotsData)
await crawler.addRequests(startUrls)

await crawler.run()

console.log(robotsData)
await Dataset.exportToCSV("output")
console.log("Crawler finished.")
ws.close()
