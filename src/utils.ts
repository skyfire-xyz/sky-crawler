import axios from "axios"
import dotenv from "dotenv"
import fs from "fs/promises"
import path from "path"
import { RobotsTxtData, USER_AGENT } from "./types"

dotenv.config()
const apiKey = process.env.SKYFIRE_API_KEY!

const robotsTxtCache: { [domain: string]: string } = {}

export function getRelativePath(path: string): string {
  const parsedPath = new URL(path)
  return parsedPath.pathname
}

export async function fetchRobotsTxt(path: string): Promise<string> {
  const domain = new URL(path).origin
  if (robotsTxtCache[domain]) {
    return robotsTxtCache[domain]
  }

  try {
    const response = await axios.get(`${domain}/robots.txt`)
    const robotsTxt = response.data
    console.log(`Fetched robots.txt\n${robotsTxt}`)
    robotsTxtCache[domain] = robotsTxt
    return robotsTxt
  } catch (error) {
    console.error(`Error fetching robots.txt from ${domain}:`, error)
    robotsTxtCache[domain] = "" // Cache empty response to avoid repeated requests
    return ""
  }
}

export function parseRobotsTxt(robotsTxt: string): RobotsTxtData {
  const data: RobotsTxtData = {
    paymentUrl: "",
    siteUsername: "",
    disallowedPaths: new Set(),
    paidContentPaths: {},
  }

  const lines = robotsTxt.split("\n")
  let appliesToUserAgent = false

  for (const line of lines) {
    const [directive, info] = line
      .trim()
      .split(/:(.+)/)
      .map((part) => part.trim())

    switch (directive.toLowerCase()) {
      case "payment-url":
        data.paymentUrl = info
        break
      case "site-username":
        data.siteUsername = info
        break
      case "user-agent":
        appliesToUserAgent = info === "*" || info === USER_AGENT
        break
      case "disallow":
        if (appliesToUserAgent) {
          data.disallowedPaths.add(normalizePath(info))
        }
        break
      case "paid-content":
        const [path, price] = info.split(",").map((part) => part.trim())
        data.paidContentPaths[normalizePath(path)] = {
          claimId: "",
          price: parseInt(price, 10),
        }

        break
      default:
        break
    }
  }
  return data
}

export function isAllowedByRobotsTxt(
  robotsData: RobotsTxtData,
  path: string,
): boolean {
  for (const disallowedPath of robotsData.disallowedPaths) {
    if (path.startsWith(disallowedPath)) {
      return false
    }
  }
  return true // If not specifically disallowed, assume allowed
}

export function filterAllowedLinks(
  allLinks: string[],
  robotsData: RobotsTxtData,
) {
  const allowedLinks: string[] = []
  for (const link of allLinks) {
    const relativePath = normalizePath(getRelativePath(link))
    if (isAllowedByRobotsTxt(robotsData, relativePath)) {
      allowedLinks.push(link)
    }
  }
  return allowedLinks
}

export async function processPayment(path: string, robotsData: RobotsTxtData) {
  try {
    const requestBody = {
      receiverUsername: robotsData.siteUsername,
      amount: robotsData.paidContentPaths[path].price,
    }
    const response = await axios.post(robotsData.paymentUrl, requestBody, {
      headers: {
        "skyfire-api-key": apiKey,
        "content-type": "application/json",
      },
    })
    const claimId = response.data
    robotsData.paidContentPaths[path].claimId = claimId
  } catch (error) {
    console.error(`Payment failed for ${path}:`, error)
  }
}

export function verifyClaimReceived(
  path: string,
  fullPath: string,
  robotsData: RobotsTxtData,
) {
  if (robotsData.paidContentPaths[path].claimId) {
    console.info(
      `Payment processed for access to ${path} with claimId: ${robotsData.paidContentPaths[path].claimId}`,
    )
  } else {
    console.warn(`Payment for access to ${path} failed. Skipping ${fullPath}`)
    return
  }
}

export function normalizePath(path: string): string {
  return path.endsWith("/") ? path : `${path}/`
}

export const saveHtmlToFile = async (html: string, url: string) => {
  const filename = url.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".html"
  const filepath = path.join("storage/datasets/downloaded_html", filename)
  await fs.mkdir(path.dirname(filepath), { recursive: true })
  await fs.writeFile(filepath, html, "utf-8")
}
