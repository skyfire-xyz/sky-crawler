import axios from "axios"
import { RobotsTxtData, USER_AGENT } from "./types"

const robotsTxtCache: { [domain: string]: string } = {}

export function getRelativePath(url: string): string {
  const parsedUrl = new URL(url)
  const fullPath = parsedUrl.pathname
  const basePath = "/example-website" // WHEN FINISHED TESTING, DELETE AND LET relativePath = fullPath
  const relativePath = fullPath.startsWith(basePath)
    ? fullPath.substring(basePath.length)
    : fullPath
  return relativePath
}

// Fetch and return the content of robots.txt
export async function fetchRobotsTxt(url: string): Promise<string> {
  // const domain = new URL(url).origin  USE THIS WHEN NOT TESTING
  const domain = "http://127.0.0.1:5500/example-website/"
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
    disallowedPaths: new Set(),
    paidContentPaths: {},
  }

  const lines = robotsTxt.split("\n")
  let appliesToUserAgent = false

  for (const line of lines) {
    const trimmedLine = line.trim()
    const [directive, info] = trimmedLine
      .split(/:(.+)/)
      .map((part) => part.trim())

    switch (directive.toLowerCase()) {
      case "payment-url":
        data.paymentUrl = info
      case "user-agent":
        appliesToUserAgent = info === "*" || info === USER_AGENT
        break
      case "disallow":
        if (appliesToUserAgent) {
          data.disallowedPaths.add(info)
        }
        break
      case "paid-content":
        data.paidContentPaths[info] = ""
        break
      default:
        break
    }
  }
  return data
}

export function isAllowedByRobotsTxt(
  robotsData: RobotsTxtData,
  url: string,
): boolean {
  const relativePath = getRelativePath(url)
  for (const disallowedPath of robotsData.disallowedPaths) {
    if (relativePath.startsWith(disallowedPath)) {
      return false
    }
  }

  return true // If no specific rules, assume allowed
}

export async function processPayment(
  path: string,
  paymentEndpoint: string,
  robotsData: RobotsTxtData
) {
  console.log(
    `Processing payment for access to ${path}. Hitting ${paymentEndpoint}`,
  )
  try {
    // Simulate hitting the payment endpoint
    // await axios.post(paymentEndpoint, { contentPath })
    let claimId = "1234"
    console.log(`Payment processed for ${path}. claimId: ${claimId}`)
    robotsData.paidContentPaths[path] = claimId
  } catch (error) {
    console.error(`Payment failed for ${path}:`, error)
  }

}

export function isEmptyString(str: string): boolean {
  return str.trim().length === 0
}